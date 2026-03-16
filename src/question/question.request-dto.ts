import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { QuestionType } from "./question-type.enum";

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

    @IsOptional()    
    @IsString()
    @ApiProperty({
        description: "A description of the purpose of this question."
    })
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
    isSingleLabel?: boolean;

    @IsOptional()
    @IsString()
    placeholder: string;

    @IsOptional()
    @IsString()
    name: string;
}
