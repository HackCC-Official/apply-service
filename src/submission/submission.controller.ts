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
import { ApplicationType } from 'src/application/application.entity';

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
    @Get('hackathon/users/:userId')
    findHackathonSubmissionByUserId(@Param('userId') userId : string) : Promise<SubmissionResponseDto[]> {
        return this.submissionService.findForm(userId, ApplicationType.HACKATHON);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get('organizer/users/:userId')
    findOrganizerSubmissionByUserId(@Param('userId') userId : string) : Promise<SubmissionResponseDto[]> {
        return this.submissionService.findForm(userId, ApplicationType.ORGANIZER);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get('volunteer/users/:userId')
    findVolunteerSubmissionByUserId(@Param('userId') userId : string) : Promise<SubmissionResponseDto[]> {
        return this.submissionService.findForm(userId, ApplicationType.VOLUNTEER);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get('judge/users/:userId')
    findJudgeSubmissionByUserId(@Param('userId') userId : string) : Promise<SubmissionResponseDto[]> {
        return this.submissionService.findForm(userId, ApplicationType.JUDGE);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Post('hackathon')
    createHackathonSubmission(@Body() submissions: SubmissionRequestDto[]) : Promise<SubmissionResponseDto[]> {
        return this.submissionService.createForm(submissions, ApplicationType.HACKATHON);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Post('organizer')
    createOrganizerSubmission(@Body() submissions: SubmissionRequestDto[]) : Promise<SubmissionResponseDto[]> {
        return this.submissionService.createForm(submissions, ApplicationType.ORGANIZER);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Post('volunteer')
    createVolunteerSubmission(@Body() submissions: SubmissionRequestDto[]) : Promise<SubmissionResponseDto[]> {
        return this.submissionService.createForm(submissions, ApplicationType.VOLUNTEER);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Post('judge')
    createJudgeSubmission(@Body() submissions: SubmissionRequestDto[]) : Promise<SubmissionResponseDto[]> {
        return this.submissionService.createForm(submissions, ApplicationType.JUDGE);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Delete(':userId')
    delete(@Param('userId') userId : string) : Promise<UpdateResult> {
        return this.submissionService.deleteForm(userId);
    }
}
