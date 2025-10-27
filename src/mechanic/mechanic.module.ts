import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MechanicService } from './mechanic.service.js';
import { MechanicController } from './mechanic.controller.js';
import { Mechanic } from './entities/mechanic.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Mechanic])],
  controllers: [MechanicController],
  providers: [MechanicService],
  exports: [MechanicService, TypeOrmModule],
})
export class MechanicModule {}