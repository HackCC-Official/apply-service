import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, isString, IsString, IsUUID, ValidateNested } from "class-validator";
import { Status } from "./status.enum";
import { Transform, Type } from "class-transformer";
import { SubmissionResponseDto } from "src/submission/submission.response-dto";
import { SubmissionRequestDto } from "src/submission/submission.request-dto";

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
  @ValidateNested({ each: true })
  @Type(() => SubmissionRequestDto)
  @Transform(({ value }) => {
    try {
      return JSON.parse(value); // Automatically parse the stringified JSON
    } catch (e) {
      throw new Error('Invalid JSON format in submissions');
    }
  })
  submissions: SubmissionResponseDto[];

  @IsOptional()
  @IsString()
  transcriptUrl: string;

  @IsOptional()
  @IsString()
  resumeUrl: string;
}