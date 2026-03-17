import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { QuestionType } from "./question-type.enum";
import { ApplicationType } from "src/application/application.entity";

export class QuestionRequestDto {
    @IsString()
    @ApiProperty({
        description: "The prompt for the question"
    })
    prompt : string

    @IsNumber()
    @ApiProperty({
        description: "The position number for the question within a question group"
    })
    position: number;

    @IsEnum(QuestionType)
    type: QuestionType;

    @IsOptional()
    @IsArray()
    @Type(() => String)
    possibleAnswers?: string[];

    @IsOptional()
    @IsString()
    placeholder: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsEnum(ApplicationType)
    applicationType: string;
}
