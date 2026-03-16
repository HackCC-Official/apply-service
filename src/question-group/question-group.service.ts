// question-group.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionGroup } from './question-group.entity';
import { Repository, UpdateResult } from 'typeorm';
import { QuestionGroupRequestDto } from './question-group.request-dto';
import { QuestionGroupResponseDto } from './question-group.response-dto';

@Injectable()
export class QuestionGroupService {
    constructor(
        @InjectRepository(QuestionGroup)
        private questionGroupRepository: Repository<QuestionGroup>,
    ) {}

    findById(id: number): Promise<QuestionGroupResponseDto> {
        return this.questionGroupRepository.findOne({
            where: { id },
            relations: { questions: true },
            order: { position: 'ASC', questions: { position: 'ASC' } }
        });
    }

    findAll(): Promise<QuestionGroupResponseDto[]> {
        return this.questionGroupRepository.find({
            relations: { questions: true },
            order: { position: 'ASC', questions: { position: 'ASC' } }
        });
    }

    create(questionGroup: QuestionGroupRequestDto): Promise<QuestionGroupResponseDto> {
        return this.questionGroupRepository.save(questionGroup);
    }

    delete(id: number): Promise<UpdateResult> {
        return this.questionGroupRepository.softDelete(id);
    }
}