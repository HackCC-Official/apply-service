import { Module } from '@nestjs/common';
import { SubmissionService } from './submission/submission.service';
import { SubmissionController } from './submission/submission.controller';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';
import { SubmissionModule } from './submission/submission.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question/question.entity';
import { Submission } from './submission/submission.entity';
import { ApplicationModule } from './application/application.module';
import { ApplicationController } from './application/application.controller';
import { Application } from './application/application.entity';
import { QuestionModule } from './question/question.module';
import { MinioModule } from './minio-s3/minio.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env', '.env.development'],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.get<string>('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT'),
                username: configService.get<string>('DATABASE_USERNAME'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_DB'),
                entities: [Application, Question, Submission],
                synchronize: false,
                migrationsRun: false,
            }),
            inject: [ConfigService],
        }),
        SubmissionModule,
        QuestionModule,
        ApplicationModule,
        MinioModule
    ]
})
export class AppModule {}
