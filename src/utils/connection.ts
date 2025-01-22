// src/utils/connection.ts
import { MongoAdapter } from "../adapters/MongoAdapter";
import { PostgresAdapter } from "../adapters/PostgresAdapter";
import { IDatabaseAdapter } from "../interfaces/IDatabaseAdapter";

export function getDatabaseAdapter(config: {
  type: string;
  uri: string;
  dbName?: string;
}): IDatabaseAdapter {
  switch (config.type) {
    case "mongodb":
      if (!config.dbName)
        throw new Error("Database name is required for MongoDB");
      return new MongoAdapter(config.uri, config.dbName);
    case "postgres":
      return new PostgresAdapter(config.uri);
    default:
      throw new Error("Unsupported database type");
  }
}
