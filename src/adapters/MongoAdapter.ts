// src/adapters/MongoAdapter.ts
import { MongoClient, Db } from "mongodb";
import { IDatabaseAdapter } from "../interfaces/IDatabaseAdapter";

export class MongoAdapter implements IDatabaseAdapter {
  private client: MongoClient;
  private db!: Db;

  constructor(private uri: string, private dbName: string) {
    this.client = new MongoClient(this.uri);
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db(this.dbName);
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async create(
    collection: string,
    data: Record<string, unknown>
  ): Promise<unknown> {
    const result = await this.db.collection(collection).insertOne(data);
    return { _id: result.insertedId, ...data };
  }

  async findOne(
    collection: string,
    query: Record<string, unknown>
  ): Promise<unknown> {
    return this.db.collection(collection).findOne(query);
  }

  async findAll(
    collection: string,
    query: Record<string, unknown>
  ): Promise<unknown[]> {
    return this.db.collection(collection).find(query).toArray();
  }

  async update(
    collection: string,
    query: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<unknown> {
    const result = await this.db
      .collection(collection)
      .updateOne(query, { $set: data });
    return result;
  }

  async delete(
    collection: string,
    query: Record<string, unknown>
  ): Promise<void> {
    await this.db.collection(collection).deleteOne(query);
  }
}
