import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { QuestionRequestDto } from './question.request-dto';
import { QuestionResponseDto } from './question.response-dto';
import { QuestionService } from './question.service';
import { UpdateResult } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { AccountRoles } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApplicationType } from 'src/application/application.entity';

@Controller('questions')
export class QuestionController {
    constructor(
        private questionService: QuestionService
    ) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Post('hackathon')
    createHackathonQuestion(@Body() question : QuestionRequestDto[]) : Promise<QuestionResponseDto[]> {
        return this.questionService.create(question, ApplicationType.HACKATHON)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Post('organizer')
    createOrganizerQuestion(@Body() question : QuestionRequestDto[]) : Promise<QuestionResponseDto[]> {
        return this.questionService.create(question, ApplicationType.ORGANIZER)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Post('volunteer')
    createVolunteerQuestion(@Body() question : QuestionRequestDto[]) : Promise<QuestionResponseDto[]> {
        return this.questionService.create(question, ApplicationType.VOLUNTEER)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Post('judge')
    createJudgeQuestion(@Body() question : QuestionRequestDto[]) : Promise<QuestionResponseDto[]> {
        return this.questionService.create(question, ApplicationType.JUDGE)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get(':id')
    find(@Param('id') id : number) : Promise<QuestionResponseDto> {
        return this.questionService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get('hackathon')
    findAllHackathonQuestion() : Promise<QuestionResponseDto[]> {
        return this.questionService.findAll(ApplicationType.HACKATHON);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get('organizer')
    findAllOrganizerQuestion() : Promise<QuestionResponseDto[]> {
        return this.questionService.findAll(ApplicationType.ORGANIZER);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get('volunteer')
    findAllVolunteerQuestion() : Promise<QuestionResponseDto[]> {
        return this.questionService.findAll(ApplicationType.VOLUNTEER);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get('judge')
    findAllJudgeQuestion() : Promise<QuestionResponseDto[]> {
        return this.questionService.findAll(ApplicationType.JUDGE);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Delete(':id')
    delete(@Param('id') id : number) : Promise<UpdateResult> {
        return this.questionService.delete(id);

    } 
}
