import { Module } from '@nestjs/common';
import { ReservateService } from './reservate.service';
import { ReservateController } from './reservate.controller';

@Module({
  controllers: [ReservateController],
  providers: [ReservateService],
})
export class ReservateModule {}
