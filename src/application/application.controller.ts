import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { ApplicationDTO } from "./application.dto";
import { DeleteResult } from "typeorm";
import { AccountService } from "src/account/account.service";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { AccountRoles } from "src/auth/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { max, of } from "rxjs";

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
  async create(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) application: ApplicationDTO,
    @UploadedFiles() files: { resume: Express.Multer.File[], transcript: Express.Multer.File[] }
  ) : Promise<ApplicationDTO> {
    return this.applicationService.create(
      application, { resume: files.resume[0], transcript: files.transcript[0] }
    )
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get(':id')
  find(@Param('id') id: string) : Promise<ApplicationDTO> {
    return this.applicationService.find(id);
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
