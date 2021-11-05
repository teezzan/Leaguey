import { matches } from "../controller";
import Router from "@koa/router";

const matchRoute = new Router({
    prefix: "/matches"
});
matchRoute.post("/greet", matches.helloWorld);
matchRoute.post("/list_pair_tags", matches.ListPairsAsTag);
matchRoute.post("/list_pairs", matches.ListPairs);



export { matchRoute };