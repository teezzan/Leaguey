import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";
import { IsDate, IsNumber, IsString } from "class-validator";


@Entity()
export class Match extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    div: string;

    @Column()
    @IsString()
    season: string;

    @Column({ type: "date"})
    @IsDate()
    date: Date;

    @Column()    
    @IsString()
    home_team: string;

    @Column()
    @IsString()
    away_team: string;
    
    @Column({
        default:0
    })
    @IsNumber()
    fthg: number;

    @Column({
        default:0
    })
    @IsNumber()
    ftag: number;

    @Column()
    @IsString()
    ftr: string;

    @Column({
        default:0
    })
    @IsNumber()
    hthg: number;

    @Column({
        default:0
    })
    @IsNumber()
    htag: number;

    @Column()
    @IsString()
    htr: string;


}
export const matchSchema = {
    id: { type: "string", example: 1 },
    div: { type: "string",  example: "SP1" },
    season: { type: "string",  example: "2016-2017" },
    date: { type: "string",  example: "19/18/2016" },
    home_team: { type: "string",  example: "La Coruna" },
    away_team: { type: "string",  example: "Eibar" },
    fthg: { type: "number",  example: 2},
    ftag: { type: "number",  example: 1},
    ftr: { type: "string",  example: "H" },
    hthg: { type: "number",  example: 0 },
    htag: { type: "number",  example: 0 },
    htr: { type: "string",  example: "D" }
};