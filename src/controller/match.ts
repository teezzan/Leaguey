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

    @request("get", "/list_pair_tags")
    @summary("List Available league and season pairs")
    @description("List the league and season pairs for which there are results available as string tags.")
    public static async ListPairsAsTag(ctx: Context): Promise<void> {
        let output_tags: Array<{
            div: string,
            season: string
        }> = [];

        let temp_output: Array<string> = [];

        const matches: Array<{
            match_div: string,
            match_season: string
        }> = await getManager()
            .createQueryBuilder(Match, "match")
            .select(["match.div", "match.season"])
            .execute();


        for (let i = 0; i < matches.length; i++) {
            const match = matches[i]
            let div = match.match_div;
            let season = `${match.match_season.substr(0, 4)}-20${match.match_season.substr(4)}`
            temp_output.push(`${div} ${season}`);
        }

        let output = new Set(temp_output);


        ctx.status = 200;
        ctx.body = { pairs: [...output] };
        return;
    }


    @request("get", "/list_pairs")
    @summary("List Available league and season pairs in proper json")
    @description("List the league and season pairs for which there are results available.")
    public static async ListPairs(ctx: Context): Promise<void> {
        let output_tags: Array<{
            div: string,
            season: string
        }> = [];

        let temp_output: Array<string> = [];

        const matches: Array<{
            match_div: string,
            match_season: string
        }> = await getManager()
            .createQueryBuilder(Match, "match")
            .select(["match.div", "match.season"])
            .execute();


        for (let i = 0; i < matches.length; i++) {
            const match = matches[i]
            let div = match.match_div;
            let season = `${match.match_season.substr(0, 4)}-20${match.match_season.substr(4)}`
            temp_output.push(`${div} ${season}`);
        }

        let output = [...new Set(temp_output)];
        for (let j = 0; j < output.length; j++) {
            output_tags.push({
                div: output[j].split(' ')[0],
                season: output[j].split(' ')[1],
            })
        }

        ctx.status = 200;
        ctx.body = { pairs: output_tags };
        return;
    }
}