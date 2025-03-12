import { IsNumber, IsString, IsUUID } from "class-validator";

export class ApplicationRequestDto {
    @IsUUID()
    userId : string;

    @IsNumber()
    questionId : number;

    @IsString()
    answer : string;
}
