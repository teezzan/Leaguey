import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface Config {
  port: number;
  debugLogging: boolean;
  dbsslconn: boolean;
  databaseUrl?: string;
  dbEntitiesPath: string[];
  cronJobExpression: string;
}

const isDevMode = process.env.NODE_ENV == "development";

const config: Config = {
  port: +(process.env.PORT || 3000),
  debugLogging: isDevMode,
  dbsslconn: !isDevMode,
  dbEntitiesPath: [
    ...isDevMode ? ["src/entity/**/*.ts"] : ["dist/entity/**/*.js"],
  ],
  cronJobExpression: "0 * * * *"
};

export { config };