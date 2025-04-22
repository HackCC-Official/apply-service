import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Application } from "./application.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ApplicationRequestDTO, ApplicationResponseDTO } from "./application.dto";
import { AccountService } from "src/account/account.service";
import { Status } from "./status.enum";
import { MinioService } from "src/minio-s3/minio.service";
import { v4 as uuidv4 } from 'uuid';
import { AccountDTO } from "src/account/account.dto";
import { Question } from "src/question/question.entity";
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

interface Document {
  resume: Express.Multer.File;
  transcript: Express.Multer.File;
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
    return await this.applicationRepository.findOne({ where: { userId: id }, relations: { submissions: true }})
  }

  async findAll({ status } : { status : Status }) : Promise<Application[]> {
    if (!status) {
      return await this.applicationRepository.find({ relations: { submissions: true }});
    }
    return await this.applicationRepository.find({ where: { status }, relations: { submissions: true }});
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

  async create(applicationDTO: ApplicationRequestDTO, document: Document, user: AccountDTO) : Promise<Application> {
    this.logger.info({ msg: "Attempting to create application", applicationDTO })

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



    const transcriptFilename = '/transcripts/' + this.generateFilename(applicationDTO.id, applicationDTO.userId, 'pdf');
    await this.minioService.uploadPdf(transcriptFilename, document.transcript.buffer);
    applicationDTO.transcriptUrl = transcriptFilename

    const resumeFilename = '/resumes/' + this.generateFilename(applicationDTO.id, applicationDTO.userId, 'pdf');
    await this.minioService.uploadPdf(resumeFilename, document.resume.buffer);
    applicationDTO.resumeUrl = resumeFilename;

    const application = await this.applicationRepository.save(applicationDTO)

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
      resumeUrl: application.resumeUrl
    }
  }
}