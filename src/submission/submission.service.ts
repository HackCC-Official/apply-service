import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Submission } from './submission.entity';
import { Repository, UpdateResult } from 'typeorm';
import { SubmissionRequestDto } from './submission.request-dto';
import { SubmissionResponseDto } from './submission.response-dto';
import { QuestionService } from 'src/question/question.service';
@Injectable()
export class SubmissionService {
    constructor(
        @InjectRepository(Submission)
        private submissionRepository: Repository<Submission>
    ) {}

    createForm(submission : SubmissionRequestDto[]) : Promise<SubmissionResponseDto[]> {
        return this.submissionRepository.save(submission);
    }
    findById(id : string) : Promise<SubmissionResponseDto> {
        return this.submissionRepository.findOne({ where: { id }, relations: { question: true }})
    }
    findForm(userId : string) : Promise<SubmissionResponseDto[]> {
        return this.submissionRepository.findBy({ userId: userId, });
    }
    findAll() : Promise<SubmissionResponseDto[]> {
        return this.submissionRepository.find({ relations: { question: true }});
    }
    deleteForm(userId : string) : Promise<UpdateResult> {
        return this.submissionRepository.softDelete({ userId: userId });
    }
}
