import { matches } from "../controller";
import Router from "@koa/router";

const matchRoute = new Router({
    prefix: '/matches'
});
matchRoute.get('/list_pair_tags', matches.ListPairsAsTag);
matchRoute.get('/list_pairs', matches.ListPairs);

matchRoute.get('/get_results_by_tag', matches.GetResultsByTag);
matchRoute.post('/get_results',  matches.GetResults);


export { matchRoute };