import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Submission {
    @PrimaryGeneratedColumn('uuid')
    id : number;
    
    @Column({type: "uuid"})
    userId : string;

    @Column()
    questionId : number;

    @Column()
    answer : string;
}
