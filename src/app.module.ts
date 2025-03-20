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
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TokenInterceptor } from './auth/token.interceptor';
import { HttpModule } from '@nestjs/axios';

@Module({
    providers: [
    {
        provide: APP_INTERCEPTOR,
        useClass: TokenInterceptor,
    },
    ],
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env', '.env.development'],
            isGlobal: true
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
        MinioModule,
        HttpModule,
        AccountModule,
        AuthModule,
        JwtModule
    ]
})
export class AppModule {}
