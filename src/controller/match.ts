import { Context } from "koa";
import { validate, ValidationError } from "class-validator";
import { request, summary, body, responsesAll, tagsAll, description } from "koa-swagger-decorator";

import { matchSchema, Match } from "../entity/matches"
import { getManager } from "typeorm";

@responsesAll({ 200: { description: "success" }, 400: { description: "Bad request" } })
@tagsAll(["Matches"])

export default class MatchController {

    @request("get", "/test")
    @summary("Welcome page")
    @description("A simple test message to verify the service is up and running.")
    public static async helloWorld(ctx: Context): Promise<void> {
        ctx.body = "hello world";
    }

    @request("get", "/list_pairs")
    @summary("List Available league and season pairs")
    @description("List the league and season pairs for which there are results available.")
    public static async ListPairs(ctx: Context): Promise<void> {

        const matches = await getManager()
            .createQueryBuilder(Match, "match")
            .select(["match.div", "match.season"])
            .execute();

        ctx.status = 200;
        ctx.body = { matches };
        return;
    }
}