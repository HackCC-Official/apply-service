import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { QuestionRequestDto } from './question.request-dto';
import { QuestionResponseDto } from './question.response-dto';
import { QuestionService } from './question.service';
import { UpdateResult } from 'typeorm';

@Controller('questions')
export class QuestionController {
    constructor(
        private questionService: QuestionService
    ) {}
    //Create / Update
    @Post()
    create(@Body() question : QuestionRequestDto[]) : Promise<QuestionResponseDto[]> {
        return this.questionService.create(question)
    }

    //Get 
    @Get(':id')
    find(@Param('id') id : number) : Promise<QuestionResponseDto> {
        return this.questionService.findById(id);
    }

    //Get all
    @Get()
    findAll() : Promise<QuestionResponseDto[]> {
        return this.questionService.findAll();
    }

    //Delete a question
    @Delete(':id')
    delete(@Param('id') id : number) : Promise<UpdateResult> {
        return this.questionService.delete(id);

    } 
}
