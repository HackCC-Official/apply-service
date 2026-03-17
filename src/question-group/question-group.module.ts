import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionGroup } from './question-group.entity';
import { QuestionGroupController } from './question-group.controller';
import { QuestionGroupService } from './question-group.service';

@Module({
    imports: [TypeOrmModule.forFeature([QuestionGroup])],
    controllers: [QuestionGroupController],
    providers: [QuestionGroupService],
    exports: [QuestionGroupService]
})
export class QuestionGroupModule {}
