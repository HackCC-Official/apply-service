import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    prompt : string;

    @Column()
    description : string;
}
