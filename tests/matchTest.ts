import { createConnection, getConnection, Entity, getRepository } from "typeorm";
import { MatchResults } from "../src/entity/matches"
import { config } from "../src/utils/config";
import { matches } from "../src/controller";
import { createMockContext } from '@shopify/jest-koa-mocks';
import { SeedDB } from '../src/utils/testUtils'


beforeEach(async () => {
    let conn = await createConnection({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [MatchResults],
        synchronize: true,
        logging: false,
        migrations: config.migrations,
    })
    return SeedDB();

});

afterEach(() => {
    let conn = getConnection();
    return conn.close();
});


describe('Controller Based Tests', function () {

    test("Fetch Season-Year Pair as Tags", async () => {
        const ctx = createMockContext({});
        await matches.ListPairsAsTag(ctx);
        const body = ctx.body as any;
        expect(ctx.body).toBeDefined();
        expect(ctx.status).toBe(200);

        expect(body.pairs[0]).toBe('SP1 2016-2017');
        expect(body.pairs[1]).toBe('SP1 2015-2016');
    });

    test("Fetch Season-Year Pair as JSON", async () => {
        const ctx = createMockContext({});
        await matches.ListPairs(ctx);
        const body = ctx.body as any;

        expect(ctx.body).toBeDefined();
        expect(ctx.status).toBe(200);

        expect(body.pairs.length).toBe(2);
        expect(body.pairs[0]).toMatchObject({ div: 'SP1', season: '2016-2017' });
        expect(body.pairs[1]).toMatchObject({ div: 'SP1', season: '2015-2016' });

    });

    test("Get Result By Tag", async () => {
        const ctx = createMockContext({ url: '/get_results_by_tag?tag=SP1 2015-2016' });

        await matches.GetResultsByTag(ctx);
        const body = ctx.body as any;

        expect(ctx.body).toBeDefined();
        expect(ctx.status).toBe(200);
        expect(body.results.length).toBeGreaterThan(10);
        expect(body.results[0]).toMatchObject({
            'id': 381,
            'div': 'SP1',
            'season': '201516',
            'date': '21/08/2015',
            'home_team': 'Malaga',
            'away_team': 'Sevilla',
            'fthg': 0,
            'ftag': 0,
            'ftr': 'D',
            'hthg': 0,
            'htag': 0,
            'htr': 'D'
        });


    });

    test("Get Result By JSON Body", async () => {
        const ctx = createMockContext({
            url: '/get_results', requestBody: {
                div: "SP1",
                season: "2015-2016"
            }
        });

        await matches.GetResults(ctx);
        const body = ctx.body as any;

        expect(ctx.body).toBeDefined();
        expect(ctx.status).toBe(200);
        expect(body.results.length).toBeGreaterThan(10);
        expect(body.results[0]).toMatchObject({
            'id': 381,
            'div': 'SP1',
            'season': '201516',
            'date': '21/08/2015',
            'home_team': 'Malaga',
            'away_team': 'Sevilla',
            'fthg': 0,
            'ftag': 0,
            'ftr': 'D',
            'hthg': 0,
            'htag': 0,
            'htr': 'D'
        });


    });

    test("Get Result By Tag To Return PDF Link", async () => {
        const ctx = createMockContext({ url: '/get_results_by_tag?format=pdf' });

        await matches.GetResults(ctx);
        const body = ctx.body as any;

        expect(ctx.body).toBeDefined();
        expect(ctx.status).toBe(200);
        expect(body.link).toBeDefined();



    }, 15000);
});