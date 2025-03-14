import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { Status } from "./status.enum";

export class ApplicationDTO {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsEnum(Status)
  status: Status;
}