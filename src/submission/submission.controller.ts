import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { UpdateResult } from 'typeorm';
import { SubmissionResponseDto } from './submission.response-dto';
import { application } from 'express';
import { SubmissionRequestDto } from './submission.request-dto';

@Controller('submissions')
export class SubmissionController {
    constructor(    
        private submissionService : SubmissionService,
    ) {}
    @Get(':id')
    findById(@Param('id') id : string) : Promise<SubmissionResponseDto> {
        return this.submissionService.findById(id);
    }
    @Get('users/:userId')
    findSubmission(@Param('userId') userId : string) : Promise<SubmissionResponseDto[]> {
        return this.submissionService.findForm(userId);
    }
    @Post()
    create(@Body() submissions: SubmissionRequestDto[]) : Promise<SubmissionResponseDto[]> {
        return this.submissionService.createForm(submissions);
    }
    @Delete(':userId')
    delete(@Param('userId') userId : string) : Promise<UpdateResult> {
        return this.submissionService.deleteForm(userId);
    }
}
