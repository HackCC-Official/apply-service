import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationResponseDto } from './application.response-dto';
import { ApplicationRequestDto } from './application.request-dto';
import { UpdateResult } from 'typeorm';

@Controller('application')
export class ApplicationController {
    constructor(
        private applicationService : ApplicationService,
    ) {}
    @Get(':id')
    find(@Param('id') id : number) : Promise<ApplicationResponseDto> {
        return this.applicationService.find(id);
    }
    @Get(':userId')
    findForm(@Param('userId') userId : string) : Promise<ApplicationResponseDto[]> {
        return this.applicationService.findForm(userId);
    }
    @Post()
    create(@Body() application : ApplicationRequestDto[]) : Promise<ApplicationResponseDto[]> {
        return this.applicationService.createForm(application);
    }
    @Delete(':userId')
    delete(@Param('userId') userId : string) : Promise<UpdateResult> {
        return this.applicationService.deleteForm(userId);
    }
}
