import { MigrationInterface, QueryRunner, getManager } from "typeorm";
import { MatchResults } from "../entity/matches";
import csv from 'csvtojson';
const csvFilePath = 'data/Data.csv';

export class SeedData1636238721151 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("Running Seeding migration");


        const importDataArray = await csv().fromFile(csvFilePath);
        const fixedDataArray = importDataArray.map(el => {
            return {
                id: el.field1,
                div: el.Div,
                season: el.Season,
                date: el.Date,
                home_team: el.HomeTeam,
                away_team: el.AwayTeam,
                fthg: el.FTHG,
                ftag: el.FTAG,
                ftr: el.FTR,
                hthg: el.HTHG,
                htag: el.HTAG,
                htr: el.HTR,

            }
        });

        await getManager()
            .createQueryBuilder()
            .insert()
            .into(MatchResults)
            .values(fixedDataArray)
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
