import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class QuestionRequestDto {
    @IsString()
    @ApiProperty({
        description: "The prompt for the question"
    })
    prompt : string

    @IsString()
    @ApiProperty({
        description: "A description of the purpose of this question."
    })
    description : string
}
