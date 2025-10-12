import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateReservateDto } from './dto/create-reservate.dto';
import { UpdateReservateDto } from './dto/update-reservate.dto';
import { Reservate } from './entities/reservate.entity';
import { Client } from 'src/client/entities/client.entity';
import { Service } from 'src/service/entities/service.entity';

@Injectable()
export class ReservateService {
  constructor(
    @InjectRepository(Reservate)
    private readonly reservateRepository: Repository<Reservate>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createReservate: CreateReservateDto): Promise<void> {
    // const { clientCode, serviceCodes, reservationDate } = createReservate;
    const { clientCode, serviceCodes } = createReservate;

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

    const totalPrice = services.reduce(
      (sum, service) => sum + service.price,
      0,
    );

    const newReservate = this.reservateRepository.create({
      ...createReservate,
      code: Date.now(), // Simple unique code generation
      client,
      services,
      totalPrice,
    });

    await this.reservateRepository.save(newReservate);
  }

  findAll(): Promise<Reservate[]> {
    return this.reservateRepository.find({
      relations: ['client', 'services'],
    });
  }

  async findOne(code: number): Promise<Reservate> {
    const reservate = await this.reservateRepository.findOne({
      where: { code },
      relations: ['client', 'services'],
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
