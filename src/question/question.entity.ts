// question.entity.ts
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { QuestionType } from "./question-type.enum";
import { ApplicationType } from "src/application/application.entity";
import { QuestionGroup } from "src/question-group/question-group.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    prompt: string;

    @Column()
    position: number;

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

    @ManyToOne(() => QuestionGroup, (questionGroup) => questionGroup.questions)
    @JoinColumn({ name: 'groupId' })
    @Exclude()
    group?: QuestionGroup;

    @Column({ nullable: true })
    isSingleLabel?: boolean;

    @Column({ nullable: true })
    placeholder: string;

    @Column({ nullable: true })
    name: string;

    @Column({ type: 'text' })
    applicationType: ApplicationType;
}