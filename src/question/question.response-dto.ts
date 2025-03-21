import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { QuestionType } from "./question-type.enum";

export class QuestionResponseDto {
    @IsNumber()
    id : number

    @IsString()
    prompt : string

    @IsOptional()
    @IsString()
    description?: string

    @IsEnum(QuestionType)
    type: QuestionType;

    @IsOptional()
    @IsArray()
    @Type(() => String)
    possibleAnswers?: string[];

    @IsOptional()
    @IsBoolean()
    isApplicationField?: boolean;

    @IsOptional()
    @IsString()
    applicationField?: string;

    @IsOptional()
    @IsString()
    group?: string

    @IsOptional()
    @IsString()
    isSingleLabel?: boolean;
}
