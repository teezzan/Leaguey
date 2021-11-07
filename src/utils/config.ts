import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface Config {
  host: string,
  username: string,
  password: string,
  database: string,
  port: number;
  debugLogging: boolean;
  dbsslconn: boolean;
  databaseUrl?: string;
  dbEntitiesPath: string[];
  cli: any,
  migrations: string[]
}

const isDevMode = process.env.NODE_ENV == "development";

const config: Config = {
  host: process.env.MYSQL_HOST || isDevMode ? "localhost" : "mysqldb",
  port: +(process.env.PORT || 3000),
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_ROOT_PASSWORD || 'passworD',
  database: process.env.MYSQL_DATABASE || "leaguey",
  debugLogging: isDevMode,
  dbsslconn: !isDevMode,
  dbEntitiesPath: [
    ...isDevMode ? ["src/entity/**/*.ts"] : ["dist/entity/**/*.js"],
  ],
  migrations: [
    ...isDevMode ? ["src/migrations/*.ts"] : ["dist/migrations/*.js"],
  ],
  cli: {
    migrationsDir: "src/migrations"
  }
};

export { config };