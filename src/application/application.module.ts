import { Module } from "@nestjs/common";
import { Application } from "./application.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationService } from "./application.service";
import { ApplicationController } from "./application.controller";
import { AccountModule } from "src/account/account.module";
import { MinioModule } from "src/minio-s3/minio.module";
import { SubmissionModule } from "src/submission/submission.module";
import { QuestionModule } from "src/question/question.module";
import { AccountProducerModule } from "src/account-producer/account-producer.module";

@Module({
  imports: [TypeOrmModule.forFeature([Application]), AccountModule, MinioModule, AccountProducerModule],
  providers: [ApplicationService],
  controllers: [ApplicationController]
})
export class ApplicationModule {}