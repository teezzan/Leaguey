import { matches } from "../controller";
import Router from "@koa/router";

const matchRoute = new Router({
    prefix: "/matches"
});
matchRoute.post("/greet", matches.helloWorld);



export { matchRoute };