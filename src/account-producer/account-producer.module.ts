import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AccountProducerService } from "./account-producer.service";

@Module({
  imports: [ConfigModule],
  providers: [AccountProducerService],
  exports: [AccountProducerService]
})
export class AccountProducerModule {}