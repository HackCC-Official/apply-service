import { IsArray, IsEnum, IsNumber, IsOptional, isString, IsString, IsUUID, ValidateNested } from "class-validator";
import { Status } from "./status.enum";
import { Transform, Type } from "class-transformer";
import { AccountDTO } from "src/account/account.dto";
import { Question } from "src/question/question.entity";
import { ApplicationType } from "./application.entity";

class SubmisisonApplicationDTO {
  @IsNumber()
  @IsOptional()
  questionId?: number;
  @IsOptional()
  question: Question;
  @IsString()
  answer: string;
  @IsString()
  @IsOptional()
  userId?: string;
  @IsEnum(ApplicationType)
  applicationType: ApplicationType;
}

export class ApplicationResponseDTO {
  @IsOptional()
  @IsUUID()
  id: string;
  
  @Type(() => AccountDTO)
  user: AccountDTO;

  @IsEnum(Status)
  status: Status;
  
  @IsOptional()
  @IsUUID()
  reviewerId?: string;

  @Transform(({ value }) => typeof value === "string" ? JSON.parse(value) : value)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmisisonApplicationDTO)
  submissions: SubmisisonApplicationDTO[];

  @IsEnum(ApplicationType)
  type: ApplicationType;
}

export class ApplicationRequestDTO {
  @IsOptional()
  @IsUUID()
  id: string;
  
  @IsUUID()
  userId: string;

  @Transform(({ value }) => typeof value === "string" ? JSON.parse(value) : value)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmisisonApplicationDTO)
  submissions: SubmisisonApplicationDTO[];
}

export class ApplicationStatistics {
  accepted: number;
  denied: number;
  submitted: number;
}