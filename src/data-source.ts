import "reflect-metadata";
import { DataSource } from "typeorm";
import { Connection } from "./models/Connection";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "connections_db",
    synchronize: true, // Use only for dev/testing, use migrations in prod
    logging: false,
    entities: [Connection],
    subscribers: [],
    migrations: [],
});
