import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientVehicleDto } from './dto/create-client-vehicle.dto';
import { UpdateClientVehicleDto } from './dto/update-client-vehicle.dto';
import { ClientVehicle } from './entities/client-vehicle.entity';
import { Client } from '../client/entities/client.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';

@Injectable()
export class ClientVehicleService {
  constructor(
    @InjectRepository(ClientVehicle)
    private readonly clientVehicleRepository: Repository<ClientVehicle>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createClientVehicleDto: CreateClientVehicleDto): Promise<ClientVehicle> {
    const { clientCode, vehicleId, isPrimary, notes, isActive } = createClientVehicleDto;

    // Verificar que el cliente existe
    const client = await this.clientRepository.findOne({ where: { code: clientCode } });
    if (!client) {
      throw new NotFoundException(`Cliente con código ${clientCode} no encontrado`);
    }

    // Verificar que el vehículo existe
    const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new NotFoundException(`Vehículo con ID ${vehicleId} no encontrado`);
    }

    // Verificar que no exista ya esta relación
    const existingRelation = await this.clientVehicleRepository.findOne({
      where: { clientCode, vehicleId },
    });
    if (existingRelation) {
      throw new BadRequestException('Esta relación cliente-vehículo ya existe');
    }

    // Si se marca como principal, desmarcar otros vehículos principales del cliente
    if (isPrimary) {
      await this.clientVehicleRepository.update(
        { clientCode, isPrimary: true },
        { isPrimary: false },
      );
    }

    const clientVehicle = this.clientVehicleRepository.create({
      clientCode,
      vehicleId,
      isPrimary: isPrimary ?? false,
      ...(notes !== undefined && { notes }),
      isActive: isActive ?? true,
    });

    return this.clientVehicleRepository.save(clientVehicle);
  }

  async findAll(): Promise<ClientVehicle[]> {
    return await this.clientVehicleRepository.find({
      relations: ['client', 'vehicle'],
      order: { addedDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ClientVehicle> {
    const clientVehicle = await this.clientVehicleRepository.findOne({
      where: { id },
      relations: ['client', 'vehicle'],
    });

    if (!clientVehicle) {
      throw new NotFoundException(`Relación cliente-vehículo con ID ${id} no encontrada`);
    }

    return clientVehicle;
  }

  async findByClient(clientCode: number): Promise<ClientVehicle[]> {
    const client = await this.clientRepository.findOne({ where: { code: clientCode } });
    if (!client) {
      throw new NotFoundException(`Cliente con código ${clientCode} no encontrado`);
    }

    return await this.clientVehicleRepository.find({
      where: { clientCode },
      relations: ['vehicle'],
      order: { isPrimary: 'DESC', addedDate: 'DESC' },
    });
  }

  async findByVehicle(vehicleId: number): Promise<ClientVehicle[]> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new NotFoundException(`Vehículo con ID ${vehicleId} no encontrado`);
    }

    return await this.clientVehicleRepository.find({
      where: { vehicleId },
      relations: ['client'],
      order: { addedDate: 'DESC' },
    });
  }

  async update(id: number, updateClientVehicleDto: UpdateClientVehicleDto): Promise<ClientVehicle> {
    const clientVehicle = await this.findOne(id);

    const { isPrimary, notes, isActive } = updateClientVehicleDto;

    // Si se marca como principal, desmarcar otros vehículos principales del mismo cliente
    if (isPrimary === true && !clientVehicle.isPrimary) {
      await this.clientVehicleRepository.update(
        { clientCode: clientVehicle.clientCode, isPrimary: true },
        { isPrimary: false },
      );
    }

    Object.assign(clientVehicle, {
      ...(isPrimary !== undefined && { isPrimary }),
      ...(notes !== undefined && { notes }),
      ...(isActive !== undefined && { isActive }),
    });

    return await this.clientVehicleRepository.save(clientVehicle);
  }

  async remove(id: number): Promise<void> {
    const clientVehicle = await this.findOne(id);
    await this.clientVehicleRepository.remove(clientVehicle);
  }

  async setPrimary(id: number): Promise<ClientVehicle> {
    const clientVehicle = await this.findOne(id);

    // Desmarcar todos los vehículos principales del cliente
    await this.clientVehicleRepository.update(
      { clientCode: clientVehicle.clientCode, isPrimary: true },
      { isPrimary: false },
    );

    // Marcar este como principal
    clientVehicle.isPrimary = true;
    return await this.clientVehicleRepository.save(clientVehicle);
  }
}
