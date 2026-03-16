import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class QuestionGroupRequestDto {
    @IsString()
    @ApiProperty({
        description: "The name of the question group"
    })
    name: string;

    @IsNumber()
    @ApiProperty({
        description: "The position of the question group"
    })
    position: number;
}