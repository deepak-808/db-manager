// src/interfaces/IDatabaseAdapter.ts
export interface IDatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  create(collection: string, data: Record<string, unknown>): Promise<unknown>;
  findOne(collection: string, query: Record<string, unknown>): Promise<unknown>;
  findAll(
    collection: string,
    query: Record<string, unknown>
  ): Promise<unknown[]>;
  update(
    collection: string,
    query: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<unknown>;
  delete(collection: string, query: Record<string, unknown>): Promise<void>;
}
