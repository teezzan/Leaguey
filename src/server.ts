import Koa from "koa";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import cors from "@koa/cors";
import winston from "winston";
import { createConnection, ConnectionOptions } from "typeorm";
import "reflect-metadata";

import { SwaggerRouter } from "koa-swagger-decorator";
import { logger } from "./utils/logger";
import { config } from "./utils/config";
import { matchRoute } from "./routes/matchRoute";
import { cron } from "./utils/cron";


const connectionOptions: ConnectionOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username:"localuser",
    password:"passworD1234!@#$",
    database:"leaguey",
    synchronize: true,
    logging: false,
    entities: config.dbEntitiesPath,
    ssl: config.dbsslconn, 
    extra: {}
};
if (connectionOptions.ssl) {
    connectionOptions.extra.ssl = {
        rejectUnauthorized: false 
    };
}


createConnection(connectionOptions).then(async () => {

    const app = new Koa();

    // Provides important security headers to make your app more secure
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "fonts.googleapis.com"],
            fontSrc: ["'self'", "fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "online.swagger.io", "validator.swagger.io"]
        }
    }));

    app.use(cors());
    app.use(logger(winston));
    app.use(bodyParser());

    app.use(matchRoute.routes()).use(matchRoute.allowedMethods());

    cron.start();


    const swaggerRoute = new SwaggerRouter({});
    swaggerRoute.swagger({
        title: "Leaguey",
        description: "Leauge Results at your finertips.",
        version: "0.1.0"
    });
    swaggerRoute.mapDir(__dirname);
    app.use(swaggerRoute.routes()).use(swaggerRoute.allowedMethods());


    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });

}).catch((error: string) => console.log("TypeORM connection error: ", error));