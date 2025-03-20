import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionResponseDto } from './submission.response-dto';
import { SubmissionRequestDto } from './submission.request-dto';
import { UpdateResult } from 'typeorm';

@Controller('submissions')
export class SubmissionController {
    constructor(    
        private submissionService : SubmissionService,
    ) {}
    @Get(':id')
    find(@Param('id') id : number) : Promise<SubmissionResponseDto> {
        return this.submissionService.find(id);
    }
    @Get('users/:userId')
    findSubmission(@Param('userId') userId : string) : Promise<SubmissionResponseDto[]> {
        return this.submissionService.findForm(userId);
    }
    @Post()
    create(@Body() application : SubmissionRequestDto[]) : Promise<SubmissionResponseDto[]> {
        return this.submissionService.createForm(application);
    }
    @Delete(':userId')
    delete(@Param('userId') userId : string) : Promise<UpdateResult> {
        return this.submissionService.deleteForm(userId);
    }
}
