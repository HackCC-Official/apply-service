import { Module } from "@nestjs/common";
import { Application } from "./application.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationService } from "./application.service";
import { ApplicationController } from "./application.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  providers: [ApplicationService],
  controllers: [ApplicationController]
})
export class ApplicationModule {}