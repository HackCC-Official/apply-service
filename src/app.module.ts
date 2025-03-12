import { Module } from '@nestjs/common';
import { ApplicationService } from './application/application.service';
import { ApplicationController } from './application/application.controller';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';
import { ApplicationModule } from './application/application.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question/question.entity';
import { Application } from './application/application.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env', '.env.development'],
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [Question, Application],
            synchronize: true,
        }),
        ApplicationModule],
    controllers: [ ApplicationController, QuestionController],
    providers: [ ApplicationService, QuestionService],
})
export class AppModule {}
