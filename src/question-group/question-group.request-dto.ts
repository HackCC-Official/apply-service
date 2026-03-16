import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { ApplicationType } from "src/application/application.entity";

export class QuestionGroupRequestDto {
    @IsString()
    @ApiProperty({
        description: "The name of the question group"
    })
    name: string;


    @IsEnum(ApplicationType)
    applicationType: ApplicationType;

    @IsNumber()
    @ApiProperty({
        description: "The position of the question group"
    })
    position: number;
}