import "reflect-metadata";
import { DataSource } from "typeorm";
import { Record } from "../entities/History.js";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // 개발단계에서만 true!!
  logging: false,
  entities: [Record],
});
