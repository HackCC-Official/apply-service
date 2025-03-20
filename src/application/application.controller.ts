import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { ApplicationDTO } from "./application.dto";
import { DeleteResult } from "typeorm";
import { AccountService } from "src/account/account.service";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { AccountRoles } from "src/auth/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";

@Controller('applications')
export class ApplicationController {
  constructor(
    private applicationService: ApplicationService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Post()
  async create(@Body() application: ApplicationDTO) : Promise<ApplicationDTO> {    
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
