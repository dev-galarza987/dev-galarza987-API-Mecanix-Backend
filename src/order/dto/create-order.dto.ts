import {
  IsInt,
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  IsEmail,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../types/OrderStatus';
import { PaymentMethod } from '../../types/PaymentMethod';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Código único de la orden de trabajo',
    example: 'ORD-2024-001',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  code!: string;

  @ApiProperty({
    description: 'ID de la reservación asociada',
    example: 1,
    type: 'integer',
  })
  @IsInt()
  reservateId: number;

  @ApiProperty({
    description: 'ID del vehículo a reparar',
    example: 1,
    type: 'integer',
  })
  @IsInt()
  vehicleId: number;

  @ApiProperty({
    description: 'ID del mecánico asignado',
    example: 1,
    type: 'integer',
  })
  @IsInt()
  mechanicId: number;

  @ApiPropertyOptional({
    description: 'Estado actual de la orden',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Diagnóstico inicial del vehículo',
    example: 'Problema en el sistema de frenos, pastillas desgastadas',
  })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del trabajo realizado',
    example: 'Cambio de pastillas de freno delanteras y posterior',
  })
  @IsString()
  @IsOptional()
  workDescription?: string;

  @ApiPropertyOptional({
    description: 'Fecha de inicio del trabajo',
    example: '2024-11-14T08:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Fecha de finalización del trabajo',
    example: '2024-11-14T16:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  @IsOptional()
  completionDate?: Date;

  // ==================== CAMPOS DE FACTURACIÓN ====================

  @ApiProperty({
    description: 'NIT o CI del cliente para facturación (7-10 dígitos)',
    example: 12345678,
    minimum: 1000000,
    maximum: 9999999999,
  })
  @IsInt()
  @Min(1000000)
  @Max(9999999999)
  clientNitCi: number;

  @ApiProperty({
    description: 'Nombre completo del cliente para facturación',
    example: 'Juan Carlos Pérez García',
    maxLength: 150,
  })
  @IsString()
  @MaxLength(150)
  clientName: string;

  @ApiPropertyOptional({
    description: 'Email del cliente para envío de factura',
    example: 'juan.perez@email.com',
    format: 'email',
  })
  @IsEmail()
  @IsOptional()
  clientEmail?: string;

  @ApiProperty({
    description: 'Subtotal antes de impuestos',
    example: 500.00,
    type: 'number',
    format: 'decimal',
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal: number;

  @ApiProperty({
    description: 'Monto de IVA (13%)',
    example: 65.00,
    type: 'number',
    format: 'decimal',
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  taxAmount: number;

  @ApiProperty({
    description: 'Total a pagar (subtotal + IVA)',
    example: 565.00,
    type: 'number',
    format: 'decimal',
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalCost: number;

  @ApiProperty({
    description: 'Método de pago utilizado',
    enum: PaymentMethod,
    example: PaymentMethod.CASH,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}

