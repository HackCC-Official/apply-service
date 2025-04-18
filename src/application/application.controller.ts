import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { ApplicationRequestDTO, ApplicationResponseDTO } from "./application.dto";
import { DeleteResult } from "typeorm";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { AccountRoles } from "src/auth/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { containsRole } from "src/auth/utils";
import { AuthRequest } from "src/auth/auth-request";
import { Status } from "./status.enum";
import { AccountService } from "src/account/account.service";
import { MinioService } from "src/minio-s3/minio.service";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

@Controller('applications')
export class ApplicationController {
  constructor(
    private applicationService: ApplicationService,
    private accountService: AccountService,
    private minioService: MinioService,
    @InjectPinoLogger(AccountService.name)
    private readonly logger: PinoLogger,
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
        const allowedMimes = [
          'application/pdf',
          'application/x-pdf',
          'application/acrobat',
          'applications/vnd.pdf',
          'application/x-download',
          'application/download',
          'text/pdf',
          'text/x-pdf'
        ];
        if (
          !allowedMimes.includes(file.mimetype) ||
          !file.originalname.match(/\.pdf$/)
        ) {
          return callback(
            new BadRequestException('Only PDF files are allowed. File details: ' + JSON.stringify(file)),
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
    @Body() applicationDTO: ApplicationRequestDTO,
    @UploadedFiles() files: { resume: Express.Multer.File[], transcript: Express.Multer.File[] }
  ) : Promise<ApplicationResponseDTO> {
    
    const user = await this.accountService.findById(applicationDTO.userId)
    if (!user) {
      throw new Error('User with id ' + applicationDTO.userId + ' not found.');
    }
    const application = await this.applicationService.create(
      applicationDTO, { resume: files.resume[0], transcript: files.transcript[0] }, user
    )
    return this.applicationService.convertToApplicationResponseDTO(
      application,
      user
    )
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({ whitelist: true, transform: true })
    ) applicationDTO: ApplicationRequestDTO,
  ) : Promise<ApplicationResponseDTO> {
    const user = await this.accountService.findById(applicationDTO.userId)
    if (!user) {
      throw new Error('User with id ' + applicationDTO.userId + ' not found.');
    }
    const application = await this.applicationService.update(id, applicationDTO);
    return this.applicationService.convertToApplicationResponseDTO(
      application,
      user
    )
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get(':id')
  async find(@Param('id') id: string) : Promise<ApplicationResponseDTO> {
    const application = await this.applicationService.findById(id);
    const user = await this.accountService.findById(application.userId)
    application.resumeUrl = await this.minioService.generatePresignedURL(application.resumeUrl)
    application.transcriptUrl = await this.minioService.generatePresignedURL(application.transcriptUrl)
    return this.applicationService.convertToApplicationResponseDTO(
      application,
      user
    )
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
  @Get(":id")
  async findById(
    @Param("id") id: string
  ) : Promise<ApplicationResponseDTO> {
    const application = await this.applicationService.findById(id);
    const user = await this.accountService.findById(application.userId);
    return this.applicationService.convertToApplicationResponseDTO(
      application,
      user
    )
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get()
  async findAll(
    @Query("status") status: Status
  ) : Promise<ApplicationResponseDTO[]> {
    const applications = await this.applicationService.findAll({ status });
    const userIds = applications.map(a => (a.userId))
    const users = userIds.length > 0 ? await this.accountService.batchFindById(userIds) : []
    const userMap = {}

    users.forEach(u => userMap[u.id] = u)

    const applicationResponseDTOs = applications.map(a => {
      return this.applicationService.convertToApplicationResponseDTO(
        a,
        userMap[a.userId]
      )
    })

    return applicationResponseDTOs
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Delete(':id')
  delete(@Param('id') id: string) : Promise<DeleteResult> {
    return this.applicationService.delete(id)
  }
}

