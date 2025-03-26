import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { ApplicationDTO } from "./application.dto";
import { DeleteResult } from "typeorm";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { AccountRoles } from "src/auth/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { containsRole } from "src/auth/utils";
import { AuthRequest } from "src/auth/auth-request";
import { Status } from "./status.enum";

@Controller('applications')
export class ApplicationController {
  constructor(
    private applicationService: ApplicationService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @UseInterceptors(FileFieldsInterceptor(
    [
      { name: 'resume', maxCount: 1 },
      { name: 'transcript', maxCount: 1 },
    ],
    {
      limits: {
        fileSize: 1000000 * 25,
      },
      fileFilter: (req, file, callback) => {
        if (
          file.mimetype !== 'application/pdf' ||
          !file.originalname.match(/\.pdf$/)
        ) {
          return callback(
            new BadRequestException('Only PDF files are allowed.'),
            false,
          );
        }
        callback(null, true);
      },
    },
  ))
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() application: ApplicationDTO,
    @UploadedFiles() files: { resume: Express.Multer.File[], transcript: Express.Multer.File[] }
  ) : Promise<ApplicationDTO> {
    return this.applicationService.create(
      application, { resume: files.resume[0], transcript: files.transcript[0] }
    )
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({ whitelist: true, transform: true })
    ) application: ApplicationDTO,
  ) : Promise<ApplicationDTO> {
    return this.applicationService.update(id, application)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get(':id')
  find(@Param('id') id: string) : Promise<ApplicationDTO> {
    return this.applicationService.find(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get('/user/:id')
  async findByUserId(
    @Param('id') id: string,
    @Req() req: AuthRequest
  ){
    const user = req.user;

    const hasPermission = containsRole(user.user_roles, [AccountRoles.ADMIN, AccountRoles.ORGANIZER]);
    const isTheSameUser = id === user.sub;
    
    if (!isTheSameUser && !hasPermission) {
        throw new Error('no');
    }
    const application = await this.applicationService.findByUserId(id);
    if (!application) {
      return {
        status: Status.CREATED
      }
    }
    return {
      status: application.status
    }
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get()
  findAll() : Promise<ApplicationDTO[]> {
    return this.applicationService.findAll()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Delete(':id')
  delete(@Param('id') id: string) : Promise<DeleteResult> {
    return this.applicationService.delete(id)
  }
}

