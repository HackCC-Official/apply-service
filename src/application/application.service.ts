import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ApplicationResponseDto } from './application.response-dto';
import { ApplicationRequestDto } from './application.request-dto';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(Application)
        private applicationRepository: Repository<Application>,
    ) {}

    createForm(application : ApplicationRequestDto[]) : Promise<ApplicationResponseDto[]> {
        return this.applicationRepository.save(application);
    }
    find(id : number) : Promise<ApplicationResponseDto> {
        return this.applicationRepository.findOneBy({ id: id });
    }
    findForm(userId : string) : Promise<ApplicationResponseDto[]> {
        return this.applicationRepository.findBy({ userId: userId, });
    }
    findAll() : Promise<ApplicationResponseDto[]> {
        return this.applicationRepository.find();
    }
    deleteForm(userId : string) : Promise<UpdateResult> {
        return this.applicationRepository.softDelete({ userId: userId });
    }
}
