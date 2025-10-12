import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
  ) {}

  async create(createService: CreateServiceDto): Promise<void> {
    try {
      const newService = this.serviceRepository.create(createService);
      await this.serviceRepository.save(newService);
    } catch (error) {
      console.error(error);
    }
  }

  async findAll(): Promise<Service[]> {
    try {
      return await this.serviceRepository.find();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async findOne(id: number): Promise<Service | null> {
    try {
      return await this.serviceRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(error);
      return Promise.resolve(null);
    }
  }

  async update(id: number, updateService: UpdateServiceDto): Promise<void> {
    try {
      await this.serviceRepository.update(id, updateService);
    } catch (error) {
      console.error(error);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.serviceRepository.delete(id);
    } catch (error) {
      console.error(error);
    }
  }
}
