import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { UpdateResult } from 'typeorm';
import { SubmissionResponseDto } from './submission.response-dto';
import { application } from 'express';
import { SubmissionRequestDto } from './submission.request-dto';
import { AccountRoles } from 'src/auth/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('submissions')
export class SubmissionController {
    constructor(    
        private submissionService : SubmissionService,
    ) {}


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get(':id')
    findById(@Param('id') id : string) : Promise<SubmissionResponseDto> {
        return this.submissionService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get('users/:userId')
    findSubmission(@Param('userId') userId : string) : Promise<SubmissionResponseDto[]> {
        return this.submissionService.findForm(userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Post()
    create(@Body() submissions: SubmissionRequestDto[]) : Promise<SubmissionResponseDto[]> {
        return this.submissionService.createForm(submissions);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Delete(':userId')
    delete(@Param('userId') userId : string) : Promise<UpdateResult> {
        return this.submissionService.deleteForm(userId);
    }
}
