import { Type } from "class-transformer";
import { IsNumber, IsString, IsUUID } from "class-validator";
import { QuestionRequestDto } from "src/question/question.request-dto";
import { QuestionResponseDto } from "src/question/question.response-dto";
import { isStringObject } from "util/types";

export class SubmissionResponseDto {
    @IsUUID()
    id : string;

    @IsUUID()
    userId: string;

    @Type(() => QuestionResponseDto)
    question: QuestionRequestDto;

    @IsString()
    answer: string;
}
