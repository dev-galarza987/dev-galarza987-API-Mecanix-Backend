import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
  ) {}

  async create(createClient: CreateClientDto): Promise<void> {
    try {
      const newClient = this.clientRepository.create(createClient);
      await this.clientRepository.save(newClient);
    } catch (error) {
      console.error(error);
    }
  }

  async findAll(): Promise<Client[]> {
    try {
      return await this.clientRepository.find();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async findOne(code: number): Promise<Client | null> {
    try {
      return await this.clientRepository.findOne({ where: { code } });
    } catch (error) {
      console.error(error);
      return Promise.resolve(null);
    }
  }

  async update(code: number, updateClient: UpdateClientDto): Promise<void> {
    try {
      await this.clientRepository.update({ code }, updateClient);
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  }

  async remove(code: number): Promise<void> {
    try {
      await this.clientRepository.delete({ code });
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  }
}
