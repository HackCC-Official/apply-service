import { Type } from "class-transformer";
import { IsEnum, IsString, IsUUID } from "class-validator";
import { ApplicationType } from "src/application/application.entity";
import { QuestionRequestDto } from "src/question/question.request-dto";
import { QuestionResponseDto } from "src/question/question.response-dto";

export class SubmissionResponseDto {
    @IsUUID()
    id : string;

    @IsUUID()
    userId: string;

    @Type(() => QuestionResponseDto)
    question: QuestionRequestDto;

    @IsString()
    answer: string;

    @IsEnum(ApplicationType)
    applicationType: ApplicationType;
}
