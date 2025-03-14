import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "./status.enum";

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  status: Status;
}