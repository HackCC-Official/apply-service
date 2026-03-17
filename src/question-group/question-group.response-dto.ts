import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ApplicationType } from "src/application/application.entity";
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

    @IsEnum(ApplicationType)
    applicationType: ApplicationType;
}