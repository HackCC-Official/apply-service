import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Application } from "./application.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ApplicationDTO } from "./application.dto";
import { AccountService } from "src/account/account.service";
import { Status } from "./status.enum";
import { MinioService } from "src/minio-s3/minio.service";
import { v4 as uuidv4 } from 'uuid';

interface Document {
  resume: Express.Multer.File;
  transcript: Express.Multer.File;
}

@Injectable()
export class ApplicationService {
  maxWordLength = 500;

  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private accountService: AccountService,
    private minioService: MinioService,
  ) {}

  async find(id: string): Promise<ApplicationDTO> {
    return await this.applicationRepository.findOne({ where: { id }, relations: { submissions: true }})
  }

  async findByUserId(id: string): Promise<ApplicationDTO> {
    return await this.applicationRepository.findOne({ where: { userId: id }, relations: { submissions: true }})
  }

  async findAll() : Promise<ApplicationDTO[]> {
    return await this.applicationRepository.find({ relations: { submissions: true }});
  }

  generateFilename(applicationId: string, userId: string, filetype: 'pdf') {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    return `${applicationId}_${userId}_${timestamp}.${filetype}`;
  }

  largerThanMaxWordLength(text: string) {
    const len = text.split(/[\s]+/);
    if(len.length > this.maxWordLength){
        return false;
      }
    return true;
  }

  async create(applicationDTO: ApplicationDTO, document: Document) : Promise<ApplicationDTO> {
    // check if user_id exists
    const user = await this.accountService.findById(applicationDTO.userId);

    if (!user) {
      throw new Error('User with id ' + applicationDTO.userId + ' not found.');
    }

    console.log(applicationDTO)

    // give application a UUID
    applicationDTO.id = uuidv4();
    // default set status to under reveiw
    applicationDTO.status = Status.SUBMITTED;
    // set each userId in submission to the user id
    applicationDTO.submissions.forEach(s => {
      s.userId = user.id;
      if (!s.questionId) {
        throw new Error('Question is null')
      }

      if (this.largerThanMaxWordLength(s.answer)) {
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
    // then save details to user (first name and last name)
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

  async update(id: string, applicationDTO: ApplicationDTO) : Promise<ApplicationDTO> {
    // check if user_id exists
    const user = await this.accountService.findById(applicationDTO.userId);

    if (!user) {
      throw new Error('User with id ' + applicationDTO.userId + ' not found.');
    }

    const application = await this.applicationRepository.findOne(
      { 
        where: { id }, 
        relations: { submissions: true }
      }
    )

    if (!application) {
      throw new Error('Application with id ' + id + ' not found.');
    }

    application.status = applicationDTO.status;

    return await this.applicationRepository.save(application)
  }

  delete(id : string) : Promise<DeleteResult> {
    return this.applicationRepository.delete(id);
  }
}