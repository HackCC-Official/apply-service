import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { QuestionGroupRequestDto } from './question-group.request-dto';
import { QuestionGroupResponseDto } from './question-group.response-dto';
import { UpdateResult } from 'typeorm';
import { AccountRoles } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { SupabaseAuthGuard } from 'src/auth/supabase.auth.guard';
import { QuestionGroupService } from './question-group.service';
import { ApplicationType } from 'src/application/application.entity';

@Controller('question-groups')
export class QuestionGroupController {
    constructor(
        private questionGroupService: QuestionGroupService
    ) {}

    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Post()
    create(@Body() questionGroup: QuestionGroupRequestDto): Promise<QuestionGroupResponseDto> {
        return this.questionGroupService.create(questionGroup);
    }

    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get()
    findAll(): Promise<QuestionGroupResponseDto[]> {
        return this.questionGroupService.findAll();
    }

    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get('hackathon')
    findAllHackathon(): Promise<QuestionGroupResponseDto[]> {
        return this.questionGroupService.findAllByType(ApplicationType.HACKATHON);
    }

    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get('organizer')
    findAllOrganizer(): Promise<QuestionGroupResponseDto[]> {
        return this.questionGroupService.findAllByType(ApplicationType.ORGANIZER);
    }

    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get('judge')
    findAllJudge(): Promise<QuestionGroupResponseDto[]> {
        return this.questionGroupService.findAllByType(ApplicationType.JUDGE);
    }

    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get(':id')
    find(@Param('id') id: number): Promise<QuestionGroupResponseDto> {
        return this.questionGroupService.findById(id);
    }

    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Delete(':id')
    delete(@Param('id') id: number): Promise<UpdateResult> {
        return this.questionGroupService.delete(id);
    }
}