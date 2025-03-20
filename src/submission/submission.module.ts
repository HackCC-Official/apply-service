import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './submission.entity';
import { QuestionModule } from 'src/question/question.module';

@Module({
  imports: [TypeOrmModule.forFeature([Submission])],
  providers: [SubmissionService],
  controllers: [SubmissionController]
})
export class SubmissionModule {}
