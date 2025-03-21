import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, isString, IsString, IsUUID, ValidateNested } from "class-validator";
import { Status } from "./status.enum";
import { Transform, Type } from "class-transformer";
import { SubmissionResponseDto } from "src/submission/submission.response-dto";
import { SubmissionRequestDto } from "src/submission/submission.request-dto";

class SubmisisonApplicationDTO {
  @IsString()
  @IsOptional()
  questionId?: string;
  @IsString()
  answer: string;
  @IsString()
  @IsOptional()
  userId?: string;
}

export class ApplicationDTO {
  @IsOptional()
  @IsUUID()
  id: string;
  
  @IsUUID()
  userId: string;

  @IsEnum(Status)
  status: Status;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  school: string;

  @IsOptional()
  @IsUUID()
  reviewerId?: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmisisonApplicationDTO)
  submissions: SubmisisonApplicationDTO[];

  @IsOptional()
  @IsString()
  transcriptUrl: string;

  @IsOptional()
  @IsString()
  resumeUrl: string;
}