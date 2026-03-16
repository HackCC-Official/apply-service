import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "./status.enum";
import { Submission } from "src/submission/submission.entity";

export enum ApplicationType {
  HACKATHON = 'HACKATHON',
  ORGANIZER = 'ORGANIZER',
  VOLUNTEER = 'VOLUNTEER',
  JUDGE = 'JUDGE'
}
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

  @Column()
  type: ApplicationType;

  @Column({ nullable: true })
  transcriptUrl: string;

  @Column({ nullable: true })
  resumeUrl: string;

  @OneToMany(() => Submission, (submission) => submission.application, { cascade: true })
  submissions: Submission[];

  @Column()
  isFile: boolean = false;
}