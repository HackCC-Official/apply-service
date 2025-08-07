import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Submission } from './submission.entity';
import { Repository, UpdateResult } from 'typeorm';
import { SubmissionRequestDto } from './submission.request-dto';
import { SubmissionResponseDto } from './submission.response-dto';
import { QuestionService } from 'src/question/question.service';
import { ApplicationType } from 'src/application/application.entity';
@Injectable()
export class SubmissionService {
    constructor(
        @InjectRepository(Submission)
        private submissionRepository: Repository<Submission>
    ) {}

    findById(id : string) : Promise<SubmissionResponseDto> {
        return this.submissionRepository.findOne({ where: { id }, relations: { question: true }})
    }

    findForm(userId : string, applicationType: ApplicationType) : Promise<SubmissionResponseDto[]> {
        return this.submissionRepository.findBy({ userId: userId, applicationType });
    }

    findAll(applicationType: ApplicationType) : Promise<SubmissionResponseDto[]> {
        return this.submissionRepository.find({ where: { applicationType }, relations: { question: true }});
    }

    createForm(submission : SubmissionRequestDto[], applicationType: ApplicationType) : Promise<SubmissionResponseDto[]> {
        return this.submissionRepository.save(submission.map(s => ({ ...s, applicationType })));
    }

    deleteForm(userId : string) : Promise<UpdateResult> {
        return this.submissionRepository.softDelete({ userId: userId });
    }
}
