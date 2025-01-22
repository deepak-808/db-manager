// src/adapters/PostgresAdapter.ts
import { Client } from "pg";
import { IDatabaseAdapter } from "../interfaces/IDatabaseAdapter";

export class PostgresAdapter implements IDatabaseAdapter {
  private client: Client;

  constructor(private connectionString: string) {
    this.client = new Client({ connectionString: this.connectionString });
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.end();
  }

  async create(table: string, data: Record<string, unknown>): Promise<unknown> {
    const keys = Object.keys(data).join(", ");
    const values = Object.values(data).map((_, i) => `$${i + 1}`);
    const query = `INSERT INTO ${table} (${keys}) VALUES (${values.join(
      ", "
    )}) RETURNING *`;
    const result = await this.client.query(query, Object.values(data));
    return result.rows[0];
  }

  async findOne(
    table: string,
    query: Record<string, unknown>
  ): Promise<unknown> {
    const key = Object.keys(query)[0];
    const value = query[key];
    const result = await this.client.query(
      `SELECT * FROM ${table} WHERE ${key} = $1 LIMIT 1`,
      [value]
    );
    return result.rows[0];
  }

  async findAll(
    table: string,
    query: Record<string, unknown> = {}
  ): Promise<unknown[]> {
    const keys: string = Object.keys(query)
      .map((k) => `${k} = $${Object.keys(query).indexOf(k) + 1}`)
      .join(" AND ");
    const queryText = `SELECT * FROM ${table} ${keys ? "WHERE " + keys : ""}`;
    const result = await this.client.query(queryText, Object.values(query));
    return result.rows;
  }

  async update(
    table: string,
    query: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<unknown> {
    const setString = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const whereKey = Object.keys(query)[0];
    const result = await this.client.query(
      `UPDATE ${table} SET ${setString} WHERE ${whereKey} = $${
        Object.keys(data).length + 1
      } RETURNING *`,
      [...Object.values(data), query[whereKey]]
    );
    return result.rows[0];
  }

  async delete(table: string, query: Record<string, unknown>): Promise<void> {
    const key = Object.keys(query)[0];
    await this.client.query(`DELETE FROM ${table} WHERE ${key} = $1`, [
      query[key],
    ]);
  }
}
