import { getManager } from "typeorm";
import { MatchResults } from "../entity/matches";
import csv from 'csvtojson';
const csvFilePath = 'data/Data.csv';

let SeedDB = async () => {

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
        .values(fixedDataArray.splice(0,400))
        .execute();
}
export { SeedDB };