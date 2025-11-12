import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderToFactusDto } from './dto/order-to-factus.dto';
import { Order } from './entities/order.entity';
import { Reservate } from '../reservate/entities/reservate.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Mechanic } from '../mechanic/entities/mechanic.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Reservate)
    private reservateRepository: Repository<Reservate>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Mechanic)
    private mechanicRepository: Repository<Mechanic>,
  ) {}

  // Constante IVA 13%
  private readonly TAX_RATE = 0.13;

  /**
   * Calcula el subtotal, IVA y total
   */
  private calculateTotals(subtotal: number): {
    subtotal: number;
    taxAmount: number;
    totalCost: number;
  } {
    const taxAmount = Number((subtotal * this.TAX_RATE).toFixed(2));
    const totalCost = Number((subtotal + taxAmount).toFixed(2));
    return { subtotal, taxAmount, totalCost };
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Validar que la reserva existe
    const reservate = await this.reservateRepository.findOne({
      where: { id: createOrderDto.reservateId },
      relations: ['services', 'client'],
    });
    if (!reservate) {
      throw new NotFoundException(
        `Reserva con ID ${createOrderDto.reservateId} no encontrada`,
      );
    }

    // Validar que el vehículo existe
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: createOrderDto.vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException(
        `Vehículo con ID ${createOrderDto.vehicleId} no encontrado`,
      );
    }

    // Validar que el mecánico existe
    const mechanic = await this.mechanicRepository.findOne({
      where: { id: createOrderDto.mechanicId },
    });
    if (!mechanic) {
      throw new NotFoundException(
        `Mecánico con ID ${createOrderDto.mechanicId} no encontrado`,
      );
    }

    // Verificar si ya existe una orden con el mismo código
    const existingOrder = await this.orderRepository.findOne({
      where: { code: createOrderDto.code },
    });
    if (existingOrder) {
      throw new BadRequestException(
        `Ya existe una orden con el código ${createOrderDto.code}`,
      );
    }

    // Validar NIT/CI (7-10 dígitos)
    const nitCiLength = createOrderDto.clientNitCi.toString().length;
    if (nitCiLength < 7 || nitCiLength > 10) {
      throw new BadRequestException(
        'El NIT/CI debe tener entre 7 y 10 dígitos',
      );
    }

    // Calcular totales con IVA 13%
    const totals = this.calculateTotals(createOrderDto.subtotal);

    const order = this.orderRepository.create({
      code: createOrderDto.code,
      reservate,
      vehicle,
      mechanic,
      status: createOrderDto.status,
      diagnosis: createOrderDto.diagnosis,
      workDescription: createOrderDto.workDescription,
      startDate: createOrderDto.startDate,
      completionDate: createOrderDto.completionDate,
      // Campos de facturación
      clientNitCi: createOrderDto.clientNitCi,
      clientName: createOrderDto.clientName,
      clientEmail: createOrderDto.clientEmail,
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      totalCost: totals.totalCost,
      paymentMethod: createOrderDto.paymentMethod,
    });

    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['reservate', 'vehicle', 'mechanic'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['reservate', 'vehicle', 'mechanic'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async findByCode(code: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { code },
      relations: ['reservate', 'vehicle', 'mechanic'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con código ${code} no encontrada`);
    }

    return order;
  }

  async updateByCode(
    code: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.findByCode(code);

    // Si se actualiza el mecánico, validar que existe
    if (updateOrderDto.mechanicId) {
      const mechanic = await this.mechanicRepository.findOne({
        where: { id: updateOrderDto.mechanicId },
      });
      if (!mechanic) {
        throw new NotFoundException(
          `Mecánico con ID ${updateOrderDto.mechanicId} no encontrado`,
        );
      }
      order.mechanic = mechanic;
    }

    // Si se actualiza el vehículo, validar que existe
    if (updateOrderDto.vehicleId) {
      const vehicle = await this.vehicleRepository.findOne({
        where: { id: updateOrderDto.vehicleId },
      });
      if (!vehicle) {
        throw new NotFoundException(
          `Vehículo con ID ${updateOrderDto.vehicleId} no encontrado`,
        );
      }
      order.vehicle = vehicle;
    }

    // Actualizar otros campos
    if (updateOrderDto.status) order.status = updateOrderDto.status;
    if (updateOrderDto.diagnosis) order.diagnosis = updateOrderDto.diagnosis;
    if (updateOrderDto.workDescription)
      order.workDescription = updateOrderDto.workDescription;
    if (updateOrderDto.startDate) order.startDate = updateOrderDto.startDate;
    if (updateOrderDto.completionDate)
      order.completionDate = updateOrderDto.completionDate;

    // Actualizar campos de facturación
    if (updateOrderDto.clientNitCi) {
      const nitCiLength = updateOrderDto.clientNitCi.toString().length;
      if (nitCiLength < 7 || nitCiLength > 10) {
        throw new BadRequestException(
          'El NIT/CI debe tener entre 7 y 10 dígitos',
        );
      }
      order.clientNitCi = updateOrderDto.clientNitCi;
    }
    if (updateOrderDto.clientName) order.clientName = updateOrderDto.clientName;
    if (updateOrderDto.clientEmail)
      order.clientEmail = updateOrderDto.clientEmail;
    if (updateOrderDto.paymentMethod)
      order.paymentMethod = updateOrderDto.paymentMethod;

    // Si se actualiza el subtotal, recalcular totales
    if (updateOrderDto.subtotal !== undefined) {
      const totals = this.calculateTotals(updateOrderDto.subtotal);
      order.subtotal = totals.subtotal;
      order.taxAmount = totals.taxAmount;
      order.totalCost = totals.totalCost;
    }

    return await this.orderRepository.save(order);
  }

  async removeByCode(code: string): Promise<void> {
    const order = await this.findByCode(code);
    await this.orderRepository.remove(order);
  }

  /**
   * Prepara los datos de la orden para enviar a Factus (Facturación Electrónica)
   * @param code Código de la orden
   * @returns Datos formateados para Factus
   */
  async prepareOrderForFactusByCode(code: string): Promise<OrderToFactusDto> {
    const order = await this.orderRepository.findOne({
      where: { code },
      relations: ['reservate', 'reservate.services', 'vehicle'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con código ${code} no encontrada`);
    }

    // Verificar que las relaciones necesarias no sean nulas
    if (!order.reservate) {
      throw new BadRequestException('La orden no tiene una reserva asociada válida');
    }

    if (!order.vehicle) {
      throw new BadRequestException('La orden no tiene un vehículo asociado válido');
    }

    // Preparar información de servicios
    const services = order.reservate.services.map((service) => ({
      serviceId: service.id,
      name: service.title,
      description: service.description,
      quantity: 1, // Cada servicio se cuenta como 1
      unitPrice: service.price,
      subtotal: service.price,
    }));

    // Construir el DTO para Factus
    const factusData: OrderToFactusDto = {
      orderCode: order.code,
      orderDate: order.completionDate || order.createdAt,
      client: {
        nitCi: order.clientNitCi,
        name: order.clientName,
        email: order.clientEmail,
      },
      services,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      totalCost: order.totalCost,
      paymentMethod: order.paymentMethod,
      vehicleInfo: {
        board: order.vehicle.board,
        brand: order.vehicle.brand,
        model: order.vehicle.model,
      },
    };

    return factusData;
  }

  /**
   * Prepara los datos de la orden para enviar a Factus (Facturación Electrónica)
   * @param orderId ID de la orden
   * @returns Datos formateados para Factus
   * @deprecated Usar prepareOrderForFactusByCode en su lugar
   */
  async prepareOrderForFactus(orderId: number): Promise<OrderToFactusDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['reservate', 'reservate.services', 'vehicle'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
    }

    // Verificar que las relaciones necesarias no sean nulas
    if (!order.reservate) {
      throw new BadRequestException('La orden no tiene una reserva asociada válida');
    }

    if (!order.vehicle) {
      throw new BadRequestException('La orden no tiene un vehículo asociado válido');
    }

    // Preparar información de servicios
    const services = order.reservate.services.map((service) => ({
      serviceId: service.id,
      name: service.title,
      description: service.description,
      quantity: 1, // Cada servicio se cuenta como 1
      unitPrice: service.price,
      subtotal: service.price,
    }));

    // Construir el DTO para Factus
    const factusData: OrderToFactusDto = {
      orderCode: order.code,
      orderDate: order.completionDate || order.createdAt,
      client: {
        nitCi: order.clientNitCi,
        name: order.clientName,
        email: order.clientEmail,
      },
      services,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      totalCost: order.totalCost,
      paymentMethod: order.paymentMethod,
      vehicleInfo: {
        board: order.vehicle.board,
        brand: order.vehicle.brand,
        model: order.vehicle.model,
      },
    };

    return factusData;
  }
}
