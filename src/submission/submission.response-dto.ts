import { IsNumber, IsString, IsUUID } from "class-validator";
import { isStringObject } from "util/types";

export class SubmissionResponseDto {
    @IsNumber()
    id : number;

    @IsUUID()
    userId : string;

    @IsNumber()
    questionId : number;

    @IsString()
    answer : string;
}
