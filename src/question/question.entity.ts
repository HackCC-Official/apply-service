import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { QuestionType } from "./question-type.enum";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    prompt: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    type: QuestionType;

    @Column('text', { array: true, nullable: true })
    possibleAnswers?: string[];

    @Column({ nullable: true })
    isApplicationField?: boolean;

    @Column({ nullable: true })
    applicationField?: string;

    @Column({ nullable: true })
    group?: string;

    @Column({ nullable: true })
    isSingleLabel?: boolean;

    @Column({ nullable: true })
    placeholder: string;

    @Column({ nullable: true })
    name: string;
}
