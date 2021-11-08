import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";
import { IsDate, IsNumber, IsString } from "class-validator";


@Entity()
export class MatchResults extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    div: string;

    @Column()
    @IsString()
    season: string;

    @Column()
    @IsDate()
    date: string;

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