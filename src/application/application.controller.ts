import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { ApplicationDTO } from "./application.dto";
import { DeleteResult } from "typeorm";

@Controller('applications')
export class ApplicationController {
  constructor(
    private applicationService: ApplicationService
  ) {}

  @Post()
  create(@Body() application: ApplicationDTO) : Promise<ApplicationDTO> {
    return this.applicationService.create(application)
  }

  @Get(':id')
  find(@Param('id') id: string) : Promise<ApplicationDTO> {
    return this.applicationService.find(id);
  }

  @Get()
  findAll() : Promise<ApplicationDTO[]> {
    return this.applicationService.findAll()
  }

  @Delete(':id')
  delete(@Param('id') id: string) : Promise<DeleteResult> {
    return this.applicationService.delete(id)
  }
}
