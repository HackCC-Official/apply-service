import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class SubmissionRequestDto {
    @IsOptional()
    @IsString()
    id: string

    @IsUUID()
    userId : string;

    @IsNumber()
    questionId: number;

    @IsString()
    answer : string;
}
