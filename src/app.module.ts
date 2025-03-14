import { Module } from '@nestjs/common';
import { SubmissionService } from './submission/submission.service';
import { SubmissionController } from './submission/submission.controller';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';
import { SubmissionModule } from './submission/submission.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question/question.entity';
import { Submission } from './submission/submission.entity';
import { ApplicationModule } from './application/application.module';
import { ApplicationController } from './application/application.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env', '.env.development'],
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [Question, Submission],
            synchronize: true,
        }),
        SubmissionModule,
        ApplicationModule
    ],
    controllers: [ SubmissionController, QuestionController, ApplicationController],
    providers: [ SubmissionService, QuestionService],
})
export class AppModule {}
