import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";
import { QuestionResponseDto } from "src/question/question.response-dto";

export class QuestionGroupResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsNumber()
    position: number;

    @IsOptional()
    @IsArray()
    @Type(() => QuestionResponseDto)
    questions?: QuestionResponseDto[];
}