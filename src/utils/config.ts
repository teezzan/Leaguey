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

const isDevMode = process.env.NODE_ENV == 'development';

let host;
if (process.env.NODE_ENV !== 'development'){
  host = 'mysqldb';  
}
else {
  host = 'localhost';
}

const config: Config = {
  host: !!process.env.MYSQL_HOST ? process.env.MYSQL_HOST : host,
  port: +(process.env.PORT || 3000),
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_ROOT_PASSWORD || 'passworD',
  database: process.env.MYSQL_DATABASE || 'leaguey',
  debugLogging: isDevMode,
  dbsslconn: false,
  dbEntitiesPath: [
    ...isDevMode ? ['src/entity/**/*.ts', 'src/entity/**/*.js'] : ['dist/entity/**/*.js'],
  ],
  migrations: [
    ...isDevMode ? ['src/migrations/*.ts', 'src/migrations/*.js'] : ['dist/migrations/*.js'],
  ],
  cli: {
    migrationsDir: 'src/migrations'
  }
};

export { config };