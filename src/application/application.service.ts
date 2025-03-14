import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Application } from "./application.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ApplicationDTO } from "./application.dto";

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>
  ) {}

  find(id: string): Promise<ApplicationDTO> {
    return this.applicationRepository.findOneBy({ id })
  }

  findAll() : Promise<ApplicationDTO[]> {
    return this.applicationRepository.find();
  }

  create(applicationDTO: ApplicationDTO) : Promise<ApplicationDTO> {
    return this.applicationRepository.save(applicationDTO)
  }

  delete(id : string) : Promise<DeleteResult> {
    return this.applicationRepository.delete(id);
  }
}