import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { Repository, UpdateResult } from 'typeorm';
import { QuestionRequestDto } from './question.request-dto';
import { QuestionResponseDto } from './question.response-dto';
import { ApplicationType } from 'src/application/application.entity';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question)
        private questionRepository: Repository<Question>,
    ) {}

    findById(id: number) : Promise<Question> {
        return this.questionRepository.findOneBy({ id })
    }
    findAll(applicationType: ApplicationType) : Promise<QuestionResponseDto[]> {
        return this.questionRepository.find({ where: { applicationType }, order: { id: 'ASC' }});
    }
    create(question : QuestionRequestDto[], applicationType: ApplicationType) : Promise<QuestionResponseDto[]> {
        return this.questionRepository.save(question.map(q => ({ ...q, applicationType })));
    }
    delete(id : number) : Promise<UpdateResult> {
        return this.questionRepository.softDelete(id);
    }
}
