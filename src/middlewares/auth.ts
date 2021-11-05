import { Context, Next } from "koa";
import { RedisClient } from "redis";
import { promisify } from 'util';

let redisClient = new RedisClient({ url: process.env.REDIS_URL });

redisClient.on("error", function (error) {
    console.error(error);
});
