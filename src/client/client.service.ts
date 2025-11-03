import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { ClientStatisticsDto } from './dto/client-statistics.dto.js';
import { TopClientDto } from './dto/top-client.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity.js';
import { Repository } from 'typeorm';
import { ClientGender } from '../types/ClientGender.js';
import { ContactMethod } from '../types/ContactMethod.js';
import { StateReservate } from '../types/StateReservate.js';

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

  // ==================== ESTADÍSTICAS Y REPORTES ====================

  /**
   * Obtener estadísticas detalladas de un cliente
   */
  async getClientStatistics(code: number): Promise<ClientStatisticsDto | null> {
    try {
      const client = await this.clientRepository.findOne({
        where: { code },
        relations: ['reservations', 'reservations.services'],
      });

      if (!client) {
        return null;
      }

      const reservations = client.reservations || [];
      
      // Calcular estadísticas
      const totalReservations = reservations.length;
      const completedReservations = reservations.filter(r => r.state === StateReservate.COMPLETED).length;
      const pendingReservations = reservations.filter(r => r.state === StateReservate.PENDING).length;
      const inProgressReservations = reservations.filter(r => r.state === StateReservate.IN_PROGRESS).length;
      
      const totalSpent = reservations
        .filter(r => r.state === StateReservate.COMPLETED)
        .reduce((sum, r) => sum + Number(r.totalPrice), 0);
      
      const averageSpentPerReservation = totalReservations > 0 
        ? totalSpent / completedReservations || 0
        : 0;

      // Obtener servicios más solicitados
      const servicesMap = new Map<string, number>();
      function isNamedService(s: unknown): s is { name: string } {
        return typeof s === 'object' && s !== null && 'name' in s && typeof (s as Record<string, unknown>).name === 'string';
      }
      reservations.forEach(reservation => {
        reservation.services?.forEach((service) => {
          const serviceName = isNamedService(service) ? service.name : 'Unknown';
          const count = servicesMap.get(serviceName) || 0;
          servicesMap.set(serviceName, count + 1);
        });
      });

      const topServices = Array.from(servicesMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);

      // Fechas de reservaciones
      const sortedReservations = reservations
        .sort((a, b) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime());
      
      const lastReservationDate = sortedReservations[0]?.reservationDate;
      const firstReservationDate = sortedReservations[sortedReservations.length - 1]?.reservationDate;

      return {
        clientCode: client.code,
        fullName: `${client.name} ${client.lastname}`,
        email: client.email || '',
        totalReservations,
        completedReservations,
        pendingReservations,
        inProgressReservations,
        totalSpent,
        lastReservationDate,
        firstReservationDate,
        averageSpentPerReservation: Math.round(averageSpentPerReservation * 100) / 100,
        topServices,
        registrationDate: client.createdAt,
        isActive: client.isActive,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Obtener los clientes que más gastan o más visitas tienen
   */
  async getTopClients(limit: number = 10): Promise<TopClientDto[]> {
    try {
      const clients = await this.clientRepository.find({
        relations: ['reservations'],
        where: { isActive: true },
      });

      const clientsWithStats = clients.map(client => {
        const reservations = client.reservations || [];
        const totalReservations = reservations.length;
        const totalSpent = reservations
          .filter(r => r.state === StateReservate.COMPLETED)
          .reduce((sum, r) => sum + Number(r.totalPrice), 0);
        
        const sortedReservations = reservations
          .sort((a, b) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime());
        const lastVisit = sortedReservations[0]?.reservationDate;

        return {
          code: client.code,
          fullName: `${client.name} ${client.lastname}`,
          email: client.email || '',
          phone: client.phone,
          totalReservations,
          totalSpent,
          lastVisit,
        };
      });

      // Ordenar por total gastado (descendente)
      return clientsWithStats
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, limit);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Obtener clientes por género
   */
  async getClientsByGender(gender: ClientGender): Promise<Client[]> {
    try {
      return await this.clientRepository.find({ where: { gender } });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Obtener clientes por método de contacto preferido
   */
  async getClientsByContactMethod(method: ContactMethod): Promise<Client[]> {
    try {
      return await this.clientRepository.find({ 
        where: { preferredContactMethod: method } 
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Obtener reporte de clientes inactivos (sin actividad en X días)
   */
  async getInactiveClientsReport(days: number = 90): Promise<Client[]> {
    try {
      const clients = await this.clientRepository.find({
        relations: ['reservations'],
        where: { isActive: true },
      });

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      return clients.filter(client => {
        const reservations = client.reservations || [];
        if (reservations.length === 0) {
          return true; // Cliente sin reservaciones
        }

        const lastReservation = reservations
          .sort((a, b) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime())[0];
        
        return new Date(lastReservation.reservationDate) < cutoffDate;
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Obtener estadísticas generales de todos los clientes
   */
  async getGeneralStatistics() {
    try {
      const totalClients = await this.clientRepository.count();
      const activeClients = await this.clientRepository.count({ where: { isActive: true } });
      const inactiveClients = await this.clientRepository.count({ where: { isActive: false } });

      const clientsWithReservations = await this.clientRepository.find({
        relations: ['reservations'],
      });

      const totalReservations = clientsWithReservations.reduce(
        (sum, client) => sum + (client.reservations?.length || 0), 
        0
      );

      const totalRevenue = clientsWithReservations.reduce((sum, client) => {
        const clientRevenue = (client.reservations || [])
          .filter(r => r.state === StateReservate.COMPLETED)
          .reduce((rSum, r) => rSum + Number(r.totalPrice), 0);
        return sum + clientRevenue;
      }, 0);

      const averageReservationsPerClient = totalClients > 0 
        ? totalReservations / totalClients 
        : 0;

      const averageRevenuePerClient = totalClients > 0 
        ? totalRevenue / totalClients 
        : 0;

      // Distribución por género
      const maleClients = await this.clientRepository.count({ 
        where: { gender: ClientGender.MALE } 
      });
      const femaleClients = await this.clientRepository.count({ 
        where: { gender: ClientGender.FEMALE } 
      });

      // Distribución por método de contacto
      const phonePreferred = await this.clientRepository.count({ 
        where: { preferredContactMethod: ContactMethod.PHONE } 
      });
      const emailPreferred = await this.clientRepository.count({ 
        where: { preferredContactMethod: ContactMethod.EMAIL } 
      });
      const whatsappPreferred = await this.clientRepository.count({ 
        where: { preferredContactMethod: ContactMethod.WHATSAPP } 
      });

      return {
        totalClients,
        activeClients,
        inactiveClients,
        totalReservations,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        averageReservationsPerClient: Math.round(averageReservationsPerClient * 100) / 100,
        averageRevenuePerClient: Math.round(averageRevenuePerClient * 100) / 100,
        genderDistribution: {
          male: maleClients,
          female: femaleClients,
        },
        contactMethodDistribution: {
          phone: phonePreferred,
          email: emailPreferred,
          whatsapp: whatsappPreferred,
        },
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
