import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "./status.enum";

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column()
  status: Status;

  @Column({ nullable: true })
  reviewer_id: string;
}