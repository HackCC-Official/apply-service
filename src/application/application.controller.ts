import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { ApplicationRequestDTO, ApplicationResponseDTO, ApplicationStatistics } from "./application.dto";
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
import { ApplicationType } from "./application.entity";
import { AccountProducerService } from "src/account-producer/account-producer.service";

@Controller('applications')
export class ApplicationController {
  constructor(
    private applicationService: ApplicationService,
    private accountService: AccountService,
    private minioService: MinioService,
    private accountProducerService: AccountProducerService,
    @InjectPinoLogger(AccountService.name)
    private readonly logger: PinoLogger,
  ) {}

  // Helper method to validate ApplicationType (case insensitive)
  private validateApplicationType(type: string): ApplicationType {
    const validTypes = Object.values(ApplicationType);
    const upperCaseType = type.toUpperCase();
    
    if (!validTypes.includes(upperCaseType as ApplicationType)) {
      throw new BadRequestException(`Invalid application type. Valid types: ${validTypes.join(', ')}`);
    }
    return upperCaseType as ApplicationType;
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get(":type/stats/")
  async getStats(@Param("type") type?: string): Promise<ApplicationStatistics> {
    let applicationType: ApplicationType | undefined;
    
    if (type) {
      applicationType = this.validateApplicationType(type);
    }
    
    return this.applicationService.getStatistics(applicationType);
  }

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
          !file.originalname.match(/\.pdf$/i)
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
  @Post(":type")
  @UsePipes(new ValidationPipe({ transform: true }))
  async createApplication(
    @Param('type') type: string,
    @Body() applicationDTO: ApplicationRequestDTO,
    @UploadedFiles() files: { resume: Express.Multer.File[], transcript: Express.Multer.File[] }
  ): Promise<ApplicationResponseDTO> {
    const applicationType = this.validateApplicationType(type);
    
    const user = await this.accountService.findById(applicationDTO.userId);
    if (!user) {
      throw new Error('User with id ' + applicationDTO.userId + ' not found.');
    }
    
    const application = await this.applicationService.create(
      applicationDTO, 
      { resume: files.resume[0], transcript: files.transcript[0] }, 
      applicationType,
      user
    );

    return this.applicationService.convertToApplicationResponseDTO(
      application,
      user
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Put(':id/accept')
  async acceptApplication(@Param('id') id: string): Promise<ApplicationResponseDTO> {
    const application = await this.applicationService.updateStatus(id, Status.ACCEPTED);
    const user = await this.accountService.findById(application.userId);
    // send to account queue for qr-code creation
    this.accountProducerService.addCreatedAccountToAccountQueue(user);
    return this.applicationService.convertToApplicationResponseDTO(
      application,
      user
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Put(':id/deny')
  async denyApplication(@Param('id') id: string): Promise<ApplicationResponseDTO> {
    const application = await this.applicationService.updateStatus(id, Status.DENIED);
    const user = await this.accountService.findById(application.userId);
    return this.applicationService.convertToApplicationResponseDTO(
      application,
      user
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get(':type/list')
  async findAllApplicationsByType(
    @Param('type') type: string,
    @Query("status") status: Status
  ): Promise<ApplicationResponseDTO[]> {
    const applicationType = this.validateApplicationType(type);
    
    const applications = await this.applicationService.findAll({ status, type: applicationType });
    const userIds = applications.map(a => a.userId);
    const users = userIds.length > 0 ? await this.accountService.batchFindById(userIds) : [];
    const userMap = {};

    users.forEach(u => userMap[u.id] = u);

    const applicationResponseDTOs = applications.map(a => {
      return this.applicationService.convertToApplicationResponseDTO(
        a,
        userMap[a.userId]
      );
    });

    return applicationResponseDTOs;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get(':type/user/:id')
  async findApplicationByUserIdAndType(
    @Param('type') type: string,
    @Param('id') id: string,
    @Req() req: AuthRequest
  ) {
    const applicationType = this.validateApplicationType(type);
    const user = req.user;

    const hasPermission = containsRole(user.user_roles, [AccountRoles.ADMIN, AccountRoles.ORGANIZER]);
    const isTheSameUser = id === user.sub;
    
    if (!isTheSameUser && !hasPermission) {
        throw new Error('no');
    }
    
    const application = await this.applicationService.findByUserId(id, applicationType);
    if (!application) {
      return {
        status: Status.NOT_AVAILABLE
      };
    }
    return {
      status: application.status
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get(':id')
  async find(@Param('id') id: string): Promise<ApplicationResponseDTO> {
    const application = await this.applicationService.findById(id);
    const user = await this.accountService.findById(application.userId);
    application.resumeUrl = await this.minioService.generatePresignedURL(application.resumeUrl);
    application.transcriptUrl = await this.minioService.generatePresignedURL(application.transcriptUrl);
    return this.applicationService.convertToApplicationResponseDTO(
      application,
      user
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Delete(':id')
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.applicationService.delete(id);
  }
}