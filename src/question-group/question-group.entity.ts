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

  @OneToMany(() => Question, (question) => question.group)
  questions: Question[];
}