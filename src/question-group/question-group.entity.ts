import { ApplicationType } from "src/application/application.entity";
import { Question } from "src/question/question.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class QuestionGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: number;

  @Column()
  name: string;

  @Column()
  applicationType: ApplicationType

  @OneToMany(() => Question, (question) => question.group)
  questions: Question[];
}