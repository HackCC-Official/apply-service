import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    id : number;

    //IsUUID
    @Column({type: "uuid"})
    userId : string;

    @Column()
    questionId : number;

    @Column()
    answer : string;
}
