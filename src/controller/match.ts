import { Context } from "koa";
import { validate, ValidationError } from "class-validator";
import { request, summary, body, query, responsesAll, tagsAll, description } from "koa-swagger-decorator";

import { MatchResults } from "../entity/matches"
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

        const matches: Array<{
            match_div: string,
            match_season: string
        }> = await getManager()
            .createQueryBuilder(MatchResults, "match")
            .select(["match.div", "match.season"])
            .execute();


        let temp_output = matches.map((match) => {
            let div = match.match_div;
            let season = `${match.match_season.substr(0, 4)}-20${match.match_season.substr(4)}`
            return `${div} ${season}`
        })


        let output = [...new Set(temp_output)];

        ctx.status = 200;
        ctx.body = { pairs: output };
        return;
    }


    @request("get", "/list_pairs")
    @summary("List Available league and season pairs in proper json")
    @description("List the league and season pairs for which there are results available.")
    public static async ListPairs(ctx: Context): Promise<void> {

        const matches: Array<{
            match_div: string,
            match_season: string
        }> = await getManager()
            .createQueryBuilder(MatchResults, "match")
            .select(["match.div", "match.season"])
            .execute();


        let temp_output = matches.map((match) => {
            let div = match.match_div;
            let season = `${match.match_season.substr(0, 4)}-20${match.match_season.substr(4)}`
            return `${div} ${season}`
        })


        let output = [...new Set(temp_output)];

        let output_tags = output.map((el) => {
            return {
                div: el.split(' ')[0],
                season: el.split(' ')[1],
            }
        })

        ctx.status = 200;
        ctx.body = { pairs: output_tags };
        return;
    }

    @request("get", "/get_pairs_by_tag")
    @summary("Get matches by tag")
    @description("Get the league results available by a tag.")
    @query({
        tag: { type: 'string', required: true, description: 'league season pair tag' },
    })
    public static async GetPairsByTag(ctx: Context): Promise<void> {
        let tag = ctx.request.query.tag as string;
        const div = tag.split(" ")[0]
        let raw_season = tag.split(" ")[1]
        let season = `${raw_season.split("-")[0]}${raw_season.split("-")[1].substr(2)}`
        let results = await getManager()
            .createQueryBuilder(MatchResults, "match")
            .where("match.div = :div", { div })
            .where("match.season = :season", { season })
            .execute();
        ctx.status = 200;
        ctx.body = { results };
        return;
    }

    @request("post", "/get_pairs")
    @summary("Get matches")
    @description("Get the league results available in a granulated form.")
    @body({
        season: { type: 'string', required: true, description: 'Season' },
        div: { type: 'string', required: true, description: 'Division' },
    })
    public static async GetPairs(ctx: Context): Promise<void> {

        const div = ctx.request.body.div;
        let raw_season = ctx.request.body.season;
        let season = `${raw_season.split("-")[0]}${raw_season.split("-")[1].substr(2)}`
        let results = await getManager()
            .createQueryBuilder(MatchResults, "match")
            .where("match.div = :div", { div })
            .where("match.season = :season", { season })
            .execute();
        ctx.status = 200;
        ctx.body = { results };
        return;
    }
}