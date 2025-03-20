import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "./status.enum";
import { Submission } from "src/submission/submission.entity";

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column()
  status: Status;

  @Column({ nullable: true })
  reviewerId: string;

  @OneToMany(
    () => Submission, 
    (submission) => submission.application, 
    {
      cascade: true
    }
  )
  submissions: Submission[];
}