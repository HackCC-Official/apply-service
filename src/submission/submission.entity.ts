import { Application } from "src/application/application.entity";
import { Question } from "src/question/question.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Submission {
    @PrimaryGeneratedColumn('uuid')
    id : string;
    
    @Column({type: "uuid"})
    userId : string;

    @ManyToOne(() => Question)
    question: Question;

    @Column()
    answer : string;

    @ManyToOne(() => Application, (application) => application.submissions)
    application: Application;
}
