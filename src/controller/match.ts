import { Context } from "koa";
import { request, summary, body, query, responsesAll, tagsAll, description } from "koa-swagger-decorator";

import { MatchResults } from "../entity/matches"
import { getManager } from "typeorm";
import axios from "axios";

const PDFDocument = require("pdfkit-table");
var FormData = require('form-data');

let remote_server_url = 'https://file.io/';


@responsesAll({ 200: { description: "success" }, 400: { description: "Bad request" } })
@tagsAll(["Matches"])

export default class MatchController {

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




    @request("get", "/get_results_by_tag")
    @summary("Get matches by tag")
    @description("Get the league results available by a tag.")
    @query({
        tag: { type: 'string', required: true, description: 'league season pair tag' },
        format: { type: 'string', required: false, description: 'return pdf' },
    })
    public static async GetResultsByTag(ctx: Context): Promise<void> {
        try {

            let tag = ctx.request.query.tag as string;
            const div = tag.split(" ")[0]
            let raw_season = tag.split(" ")[1]

            if (raw_season.split("-").length !== 2)
                throw new Error('incorrect Tag')

            let season = `${raw_season.split("-")[0]}${raw_season.split("-")[1].substr(2)}`
            let results = await MatchResults.find({ div, season });

            let format = ctx.request.query.format as string;
            if (format == 'pdf') {
                ctx.status = 200;
                ctx.body = { ... await MatchController.GeneratePDFAndUpload(results) };
                return;

            } else {
                ctx.status = 200;
                ctx.body = { results };
                return;
            }
        }
        catch (err) {
            ctx.status = 500;
            ctx.body = { message: err.message };
        }
    }



    @request("post", "/get_results")
    @summary("Get matches")
    @description("Get the league results available in a granulated form.")
    @body({
        season: { type: 'string', required: true, description: 'Season' },
        div: { type: 'string', required: true, description: 'Division' },
    })
    @query({
        format: { type: 'string', required: false, description: 'return pdf' },
    })
    public static async GetResults(ctx: Context): Promise<void> {
        try {

            const div = ctx.request.body.div;
            let raw_season = ctx.request.body.season;

            if (raw_season.split("-").length !== 2)
                throw new Error('incorrect Tag')

            let season = `${raw_season.split("-")[0]}${raw_season.split("-")[1].substr(2)}`
            let results = await MatchResults.find({ div, season });

            let format = ctx.request.query.format as string;
            if (format == 'pdf') {
                ctx.status = 200;
                ctx.body = { results: await MatchController.GeneratePDFAndUpload(results) };
                return;
            } else {
                ctx.status = 200;
                ctx.body = { results };
            }
            return;
        }
        catch (err) {
            ctx.status = 500;
            ctx.body = { message: err.message };
        }
    }

    private static async GeneratePDFAndUpload(results: any): Promise<{ link: string }> {
        return new Promise((resolve, reject) => {
            let rows = results.map((el: any) => {
                return Object.values(el)
            })

            const tableArray = {
                headers: ["id", "Div", "Season", "Date", "HomeTeam", "AwayTeam", "FTHG", "FTAG", "FTR", "HTHG", "HTAG", "HTR"],
                rows,
            };

            const doc = new PDFDocument({
                margin: 10,
            });

            let buffers: any = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let outputPdfData = Buffer.concat(buffers);
                let form = new FormData();
                form.append('file', outputPdfData, { filename: 'output.pdf', contentType: 'application/pdf' });
                form.append('expires', '2d');
                const formHeaders = form.getHeaders();

                axios.post(remote_server_url, form, {
                    headers: {
                        ...formHeaders
                    }
                }).then((resp) => {
                    resolve({ link: resp.data.link })
                }).catch((err) => {
                    reject({ message: "Server Error" });
                })
            });
            doc.table(tableArray, { width: 590 });
            doc.end();


        })


    }
}