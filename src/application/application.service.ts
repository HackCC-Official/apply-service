import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Application, ApplicationType } from "./application.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ApplicationRequestDTO, ApplicationResponseDTO, ApplicationStatistics } from "./application.dto";
import { AccountService } from "src/account/account.service";
import { Status } from "./status.enum";
import { MinioService } from "src/minio-s3/minio.service";
import { v4 as uuidv4 } from 'uuid';
import { AccountDTO } from "src/account/account.dto";
import { Question } from "src/question/question.entity";
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

interface Document {
  resume: Express.Multer.File;
  transcript?: Express.Multer.File;
}

@Injectable()
export class ApplicationService {
  maxWordLength = 500;
  maxCharLength = 3000;

  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectPinoLogger(AccountService.name)
    private readonly logger: PinoLogger,
    private accountService: AccountService,
    private minioService: MinioService,
  ) {}

  async findById(id: string): Promise<Application> {
    return await this.applicationRepository.findOne({ where: { id }, relations: { submissions: true }})
  }

  async findByUserId(id: string): Promise<Application> {
    return await this.applicationRepository.findOne({ where: { userId: id }})
  }

  async findByUserIdAndApplicationType(id: string, type: ApplicationType): Promise<Application> {
    return await this.applicationRepository.findOne({ where: { userId: id, type }, relations: { submissions: true }})
  }

  async findAll({ type, status } : { type: ApplicationType, status : Status }) : Promise<Application[]> {
    if (!status) {
      return await this.applicationRepository.find({ where: { type}, relations: { submissions: true }});
    }
    return await this.applicationRepository.find({ where: { type, status }, relations: { submissions: true }});
  }

async getStatistics(applicationType?: ApplicationType): Promise<ApplicationStatistics> {
  const queryBuilder = this.applicationRepository
    .createQueryBuilder("application")
    .select([
      `SUM(CASE WHEN application.status = 'SUBMITTED' THEN 1 ELSE 0 END) AS submitted`,
      `SUM(CASE WHEN application.status = 'DENIED' THEN 1 ELSE 0 END) AS denied`,
      `SUM(CASE WHEN application.status = 'ACCEPTED' THEN 1 ELSE 0 END) AS accepted`,
    ]);

  if (applicationType) {
    queryBuilder.where("application.type = :type", { type: applicationType });
  }

  return await queryBuilder.getRawOne();
  }

  generateFilename(applicationId: string, userId: string, filetype: 'pdf') {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    return `${applicationId}_${userId}_${timestamp}.${filetype}`;
  }

  isValidResponse(text: string) {
    if (text.length <= this.maxCharLength) {
      return true;
    }

    const len = text.split(/[\s]+/);
    if(len.length <= this.maxWordLength){
        return true;
      }
      
    return false;
  }

  async create(
    applicationDTO: ApplicationRequestDTO,
    document: Document, 
    type: ApplicationType,
    user: AccountDTO
  ) : Promise<Application> {
    this.logger.info({ msg: "Attempting to create application", applicationDTO })

    // check for existence
    const applicationExists = await this.findByUserIdAndApplicationType(user.id, type)

    if (applicationExists) {
      throw new Error('Application already exists')
    }

    // give application a UUID
    applicationDTO.id = uuidv4();
    // default set status to under reveiw
    applicationDTO.status = Status.SUBMITTED;

    // set each userId in submission to the user id
    applicationDTO.submissions.forEach(async s => {
      s.userId = user.id;
      s.question = { id: s.questionId } as Question;

      if (!s.questionId) {
        throw new Error('Question is null')
      }

      if (!this.isValidResponse(s.answer)) {
        throw new Error('Answer is too long')
      }
    });

    if (![ApplicationType.JUDGE, ApplicationType.VOLUNTEER].includes(type)) {
      const transcriptFilename = '/transcripts/' + this.generateFilename(applicationDTO.id, applicationDTO.userId, 'pdf');
      await this.minioService.uploadPdf(transcriptFilename, document.transcript.buffer);
      applicationDTO.transcriptUrl = transcriptFilename
    } else {
      applicationDTO.transcriptUrl = ''
    }

    if (type !== ApplicationType.HACKATHON) {
      const resumeFilename = '/resumes/' + this.generateFilename(applicationDTO.id, applicationDTO.userId, 'pdf');
      await this.minioService.uploadPdf(resumeFilename, document.resume.buffer);
      applicationDTO.resumeUrl = resumeFilename;
    } else {
      applicationDTO.resumeUrl = ''
    }

    const application = await this.applicationRepository.save({
      ...applicationDTO,
      type
    })

    this.logger.info({ msg: "Application created", application })

    await this.accountService.update(
      applicationDTO.userId, 
      {
        id: '',
        firstName: application.firstName,
        lastName: applicationDTO.lastName
      }
    )

    return application;
  }

  async updateStatus(id: string, status: Status) : Promise<Application> {
    const application = await this.applicationRepository.findOne(
      { 
        where: { id }, 
        relations: { submissions: true }
      }
    )

    if (!application) {
      throw new Error('Application with id ' + id + ' not found.');
    }

    application.status = status;

    return await this.applicationRepository.save(application)
  }

  delete(id : string) : Promise<DeleteResult> {
    return this.applicationRepository.delete(id);
  }
  

  convertToApplicationResponseDTO(application: Application, user: AccountDTO): ApplicationResponseDTO {
    return {
      id: application.id,
      firstName: application.firstName,
      lastName: application.lastName,
      user,
      status: application.status,
      email: application.email,
      phoneNumber: application.phoneNumber,
      school: application.school,
      submissions: application.submissions,
      transcriptUrl: application.transcriptUrl,
      resumeUrl: application.resumeUrl,
      type: application.type
    }
  }
}