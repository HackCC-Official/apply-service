import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { QuestionRequestDto } from './question.request-dto';
import { QuestionResponseDto } from './question.response-dto';
import { QuestionService } from './question.service';
import { UpdateResult } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { AccountRoles } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('questions')
export class QuestionController {
    constructor(
        private questionService: QuestionService
    ) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Post()
    create(@Body() question : QuestionRequestDto[]) : Promise<QuestionResponseDto[]> {
        return this.questionService.create(question)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get(':id')
    find(@Param('id') id : number) : Promise<QuestionResponseDto> {
        return this.questionService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Get()
    findAll() : Promise<QuestionResponseDto[]> {
        return this.questionService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
    @Delete(':id')
    delete(@Param('id') id : number) : Promise<UpdateResult> {
        return this.questionService.delete(id);

    } 
}
