import { IsNumber, IsString, IsUUID } from "class-validator";

export class SubmissionRequestDto {
    @IsUUID()
    userId : string;

    @IsNumber()
    questionId : number;

    @IsString()
    answer : string;
}
