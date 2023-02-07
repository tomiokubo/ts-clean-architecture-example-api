import { DataSource, DataSourceOptions } from "typeorm";
require("dotenv").config();

import { Account } from "./entities/account-entity";

type DbHelperType = {
  dbConfig: DataSourceOptions;
  appDataSource: DataSource | undefined;
  makeAppDataSource: (DataSourceOptions?: DataSourceOptions) => void;
  getAppDataSource: () => DataSource | undefined;
};

export const DbHelper: DbHelperType = {
  dbConfig: {
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [Account],
    subscribers: [],
    migrations: [],
  },

  appDataSource: undefined,

  makeAppDataSource(dataSourceOption?: DataSourceOptions): void {
    if (dataSourceOption) this.dbConfig = dataSourceOption;
    this.appDataSource = new DataSource(this.dbConfig);
  },

  getAppDataSource(): DataSource | undefined {
    return this.appDataSource;
  },
};
