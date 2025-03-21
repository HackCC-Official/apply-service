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

  @Column()
  firstName: string;
  
  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  school: string;

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

  @Column({ nullable: true })
  transcriptUrl: string;

  @Column({ nullable: true })
  resumeUrl: string;
}