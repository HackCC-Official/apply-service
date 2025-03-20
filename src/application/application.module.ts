import { Module } from "@nestjs/common";
import { Application } from "./application.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationService } from "./application.service";
import { ApplicationController } from "./application.controller";
import { AccountModule } from "src/account/account.module";

@Module({
  imports: [TypeOrmModule.forFeature([Application]), AccountModule],
  providers: [ApplicationService],
  controllers: [ApplicationController]
})
export class ApplicationModule {}