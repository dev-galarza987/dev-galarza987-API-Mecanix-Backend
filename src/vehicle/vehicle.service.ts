import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {}
  async create(createVehicle: CreateVehicleDto): Promise<void> {
    try {
      const newVehicle = this.vehicleRepository.create(createVehicle);
      await this.vehicleRepository.save(newVehicle);
    } catch (error) {
      console.error(error);
    }
  }

  async findAll() {
    try {
      return await this.vehicleRepository.find();
    } catch (error) {
      console.error(error);
      return Promise.resolve([]);
    }
  }

  async findOne(id: number) {
    try {
      return await this.vehicleRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: number, updateVehicle: UpdateVehicleDto) {
    try {
      await this.vehicleRepository.update({ id }, updateVehicle);
    } catch (error) {
      console.error(error);
    }
  }

  async remove(id: number) {
    try {
      await this.vehicleRepository.delete({ id });
    } catch (error) {
      console.error(error);
    }
  }
}
