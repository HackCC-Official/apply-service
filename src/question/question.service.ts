import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { Repository, UpdateResult } from 'typeorm';
import { QuestionRequestDto } from './question.request-dto';
import { QuestionResponseDto } from './question.response-dto';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question)
        private questionRepository: Repository<Question>,
    ) {}

    findById(id: number) : Promise<QuestionResponseDto> {
        return this.questionRepository.findOneBy({ id })
    }
    findAll() : Promise<QuestionResponseDto[]> {
        return this.questionRepository.find();
    }
    create(question : QuestionRequestDto[]) : Promise<QuestionResponseDto[]> {
        return this.questionRepository.save(question);
    }
    delete(id : number) : Promise<UpdateResult> {
        return this.questionRepository.softDelete(id);
    }

}
