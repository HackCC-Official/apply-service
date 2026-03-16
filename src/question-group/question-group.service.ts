// question-group.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionGroup } from './question-group.entity';
import { Repository, UpdateResult } from 'typeorm';
import { QuestionGroupRequestDto } from './question-group.request-dto';
import { QuestionGroupResponseDto } from './question-group.response-dto';
import { ApplicationType } from 'src/application/application.entity';

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

    async create(questionGroup: QuestionGroupRequestDto): Promise<QuestionGroup> {
        const entity = this.questionGroupRepository.create(questionGroup);
        return this.questionGroupRepository.save(entity);
    }

    delete(id: number): Promise<UpdateResult> {
        return this.questionGroupRepository.softDelete(id);
    }

    findAllByType(applicationType: ApplicationType): Promise<QuestionGroupResponseDto[]> {
      return this.questionGroupRepository.find({ where: { applicationType } });
  }
}