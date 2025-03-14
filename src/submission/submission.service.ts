import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Submission } from './submission.entity';
import { Repository, UpdateResult } from 'typeorm';
import { SubmissionResponseDto } from './submission.response-dto';
import { SubmissionRequestDto } from './submission.request-dto';

@Injectable()
export class SubmissionService {
    constructor(
        @InjectRepository(Submission)
        private submissionRepository: Repository<Submission>,
    ) {}

    createForm(submission : SubmissionRequestDto[]) : Promise<SubmissionResponseDto[]> {
        return this.submissionRepository.save(submission);
    }
    find(id : number) : Promise<SubmissionResponseDto> {
        return this.submissionRepository.findOneBy({ id: id });
    }
    findForm(userId : string) : Promise<SubmissionResponseDto[]> {
        return this.submissionRepository.findBy({ userId: userId, });
    }
    findAll() : Promise<SubmissionResponseDto[]> {
        return this.submissionRepository.find();
    }
    deleteForm(userId : string) : Promise<UpdateResult> {
        return this.submissionRepository.softDelete({ userId: userId });
    }
}
