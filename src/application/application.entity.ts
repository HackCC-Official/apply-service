import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    question : string;

    @Column()
    description : string;


}
