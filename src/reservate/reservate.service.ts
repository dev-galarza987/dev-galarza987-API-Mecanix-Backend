import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateReservateDto } from './dto/create-reservate.dto';
import { UpdateReservateDto } from './dto/update-reservate.dto';
import { Reservate } from './entities/reservate.entity';
import { Client } from '../client/entities/client.entity';
import { Service } from '../service/entities/service.entity';
import { Mechanic } from '../mechanic/entities/mechanic.entity';

@Injectable()
export class ReservateService {
  constructor(
    @InjectRepository(Reservate)
    private readonly reservateRepository: Repository<Reservate>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
  ) {}

  async create(createReservate: CreateReservateDto): Promise<void> {
    const { clientCode, serviceCodes, mechanicId } = createReservate;

    const client = await this.clientRepository.findOneBy({ code: clientCode });
    if (!client) {
      throw new NotFoundException(
        `Cliente con código ${clientCode} no encontrado`,
      );
    }

    const services = await this.serviceRepository.findBy({
      code: In(serviceCodes),
    });
    if (services.length !== serviceCodes.length) {
      throw new NotFoundException(
        'Uno o más códigos de servicio no fueron encontrados',
      );
    }

    let mechanic: Mechanic | undefined = undefined;
    if (mechanicId) {
      const foundMechanic = await this.mechanicRepository.findOneBy({ id: mechanicId });
      if (!foundMechanic) {
        throw new NotFoundException(
          `Mecánico con ID ${mechanicId} no encontrado`,
        );
      }
      mechanic = foundMechanic;
    }

    const totalPrice = services.reduce(
      (sum, service) => sum + service.price,
      0,
    );

    const reservateData: Partial<Reservate> = {
      code: Date.now(), // Simple unique code generation
      client,
      services,
      totalPrice,
    };

    // Solo agregar reservationDate si se proporciona explícitamente
    if (createReservate.reservationDate) {
      reservateData.reservationDate = new Date(createReservate.reservationDate);
    }

    if (mechanic) {
      reservateData.mechanic = mechanic;
    }

    const newReservate = this.reservateRepository.create(reservateData);

    await this.reservateRepository.save(newReservate);
  }

  findAll(): Promise<Reservate[]> {
    return this.reservateRepository.find({
      relations: ['client', 'services', 'mechanic'],
    });
  }

  async findOne(code: number): Promise<Reservate> {
    const reservate = await this.reservateRepository.findOne({
      where: { code },
      relations: ['client', 'services', 'mechanic'],
    });
    if (!reservate) {
      throw new NotFoundException(`Reserva con código ${code} no encontrada`);
    }
    return reservate;
  }

  async update(
    code: number,
    updateReservateDto: UpdateReservateDto,
  ): Promise<Reservate> {
    const reservate = await this.findOne(code);

    let totalPrice = reservate.totalPrice;

    // Actualizar servicios si se proporcionan
    if (updateReservateDto.serviceCodes) {
      const services = await this.serviceRepository.findBy({
        code: In(updateReservateDto.serviceCodes),
      });
      if (services.length !== updateReservateDto.serviceCodes.length) {
        throw new NotFoundException(
          'Uno o más códigos de servicio para actualizar no fueron encontrados',
        );
      }
      reservate.services = services;
      totalPrice = services.reduce((sum, service) => sum + service.price, 0);
    }

    // Actualizar mecánico si se proporciona
    if (updateReservateDto.mechanicId) {
      const mechanic = await this.mechanicRepository.findOneBy({ 
        id: updateReservateDto.mechanicId 
      });
      if (!mechanic) {
        throw new NotFoundException(
          `Mecánico con ID ${updateReservateDto.mechanicId} no encontrado`,
        );
      }
      reservate.mechanic = mechanic;
    } else if (updateReservateDto.mechanicId === null) {
      // Remover mecánico si se envía null explícitamente
      reservate.mechanic = null;
    }

    // Actualizar precio total si se proporciona
    if (updateReservateDto.totalPrice !== undefined) {
      totalPrice = updateReservateDto.totalPrice;
    }

    const updatedReservate = this.reservateRepository.merge(reservate, {
      ...updateReservateDto,
      totalPrice,
    });

    return this.reservateRepository.save(updatedReservate);
  }

  async remove(code: number): Promise<void> {
    const reservate = await this.findOne(code);
    await this.reservateRepository.remove(reservate);
  }
}
