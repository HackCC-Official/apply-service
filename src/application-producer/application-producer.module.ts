import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ApplicationProducerService } from "./application-producer.service";

@Module({
  imports: [ConfigModule],
  providers: [ApplicationProducerService],
  exports: [ApplicationProducerService]
})
export class ApplicationProducerModule {}