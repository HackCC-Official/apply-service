import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsUUID } from "class-validator";
import { Status } from "./status.enum";
import { Type } from "class-transformer";
import { SubmissionResponseDto } from "src/submission/submission.response-dto";

export class ApplicationDTO {
  @IsOptional()
  @IsUUID()
  id: string;
  
  @IsUUID()
  userId: string;

  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsUUID()
  reviewerId?: string;

  @IsArray()
  @Type(() => SubmissionResponseDto)
  submissions: SubmissionResponseDto[];
}