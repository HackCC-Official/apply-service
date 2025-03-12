import { IsNumber, IsString } from "class-validator";

export class QuestionResponseDto {
    @IsNumber()
    id : number

    @IsString()
    prompt : string

    @IsString()
    description : string
}
