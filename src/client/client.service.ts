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

  // ==================== MÉTODOS CRUD ===================
  /**
   * Crear un nuevo cliente
   */
  async create(createClient: CreateClientDto): Promise<void> {
    try {
      const newClient = this.clientRepository.create(createClient);
      await this.clientRepository.save(newClient);
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * Obtener todos los clientes
   */
  async findAll(): Promise<Client[]> {
    try {
      return await this.clientRepository.find();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Obtener un cliente por su código
   */
  async findOne(code: number): Promise<Client | null> {
    try {
      return await this.clientRepository.findOne({ where: { code } });
    } catch (error) {
      console.error(error);
      return Promise.resolve(null);
    }
  }

  /**
   * Actualizar un cliente por su código
   */
  async update(code: number, updateClient: UpdateClientDto): Promise<void> {
    try {
      await this.clientRepository.update({ code }, updateClient);
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  }

  /**
   * Eliminar un cliente por su código
   */
  async remove(code: number): Promise<void> {
    try {
      await this.clientRepository.delete({ code });
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  }

  // ==================== MÉTODOS DE BÚSQUEDA Y CONSULTAS ====================

  /**
   * Buscar cliente por email
   */
  async findByEmail(email: string): Promise<Client | null> {
    try {
      return await this.clientRepository.findOne({ where: { email } });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Buscar cliente por teléfono
   */
  async findByPhone(phone: string): Promise<Client | null> {
    try {
      return await this.clientRepository.findOne({ where: { phone } });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Buscar cliente por CI (Cédula de Identidad)
   */
  async findByCI(ci: number): Promise<Client | null> {
    try {
      return await this.clientRepository.findOne({ where: { ci } });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Búsqueda general de clientes por término (nombre, apellido, email o teléfono)
   */
  async searchClients(searchTerm: string): Promise<Client[]> {
    try {
      return await this.clientRepository
        .createQueryBuilder('client')
        .where('client.name LIKE :term', { term: `%${searchTerm}%` })
        .orWhere('client.lastname LIKE :term', { term: `%${searchTerm}%` })
        .orWhere('client.email LIKE :term', { term: `%${searchTerm}%` })
        .orWhere('client.phone LIKE :term', { term: `%${searchTerm}%` })
        .getMany();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Obtener solo clientes activos
   */
  async findActiveClients(): Promise<Client[]> {
    try {
      return await this.clientRepository.find({ where: { isActive: true } });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Obtener solo clientes inactivos
   */
  async findInactiveClients(): Promise<Client[]> {
    try {
      return await this.clientRepository.find({ where: { isActive: false } });
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
