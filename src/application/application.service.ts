import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Application } from "./application.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ApplicationDTO } from "./application.dto";
import { AccountService } from "src/account/account.service";
import { Status } from "./status.enum";
import { Submission } from "src/submission/submission.entity";

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private accountService: AccountService
  ) {}

  async find(id: string): Promise<ApplicationDTO> {
    return await this.applicationRepository.findOneBy({ id })
  }

  async findAll() : Promise<ApplicationDTO[]> {
    return await this.applicationRepository.find({ where: { submissions: true }});
  }

  async create(applicationDTO: ApplicationDTO) : Promise<ApplicationDTO> {
    // check if user_id exists
    const user = await this.accountService.findById(applicationDTO.userId);

    if (!user) {
      throw new Error('User with id ' + applicationDTO.userId + ' not found.');
    }

    // default set status to under reveiw
    applicationDTO.status = Status.SUBMITTED;
    // set each userId in submission to the user id
    applicationDTO.submissions.forEach(s => {
      s.userId = user.id;
    });
    
    return this.applicationRepository.save(applicationDTO)
  }

  delete(id : string) : Promise<DeleteResult> {
    return this.applicationRepository.delete(id);
  }
}