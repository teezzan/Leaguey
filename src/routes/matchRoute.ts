import { matches } from "../controller";
import Router from "@koa/router";

const matchRoute = new Router({
    prefix: "/matches"
});
matchRoute.get("/greet", matches.helloWorld);
matchRoute.get("/list_pair_tags", matches.ListPairsAsTag);
matchRoute.get("/list_pairs", matches.ListPairs);

matchRoute.get("/get_pairs_by_tag", matches.GetPairsByTag);
matchRoute.post("/get_pairs", matches.GetPairs);



export { matchRoute };