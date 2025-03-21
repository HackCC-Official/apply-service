import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { QuestionType } from "./question-type.enum";

export class QuestionRequestDto {
    @IsString()
    @ApiProperty({
        description: "The prompt for the question"
    })
    prompt : string

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
    group?: string

    @IsOptional()
    @IsString()
    isSingleLabel?: boolean;
}
