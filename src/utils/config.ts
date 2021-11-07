import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface Config {
  host: string,
  port: number;
  debugLogging: boolean;
  dbsslconn: boolean;
  databaseUrl?: string;
  dbEntitiesPath: string[];
  cronJobExpression: string;
  cli: any,
  migrations: string[]
}

const isDevMode = process.env.NODE_ENV == "development";

const config: Config = {
  host: isDevMode?"localhost":"mysqldb",
  port: +(process.env.PORT || 3000),
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
  },
  cronJobExpression: "0 * * * *"
};

export { config };