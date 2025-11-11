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
import { OrderStatus } from '../../types/OrderStatus';
import { PaymentMethod } from '../../types/PaymentMethod';

export class CreateOrderDto {
  @IsString()
  @MaxLength(20)
  code!: string;

  @IsInt()
  reservateId: number;

  @IsInt()
  vehicleId: number;

  @IsInt()
  mechanicId: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  workDescription?: string;

  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  completionDate?: Date;

  // ==================== CAMPOS DE FACTURACIÓN ====================

  @IsInt()
  @Min(1000000)
  @Max(9999999999)
  clientNitCi: number;

  @IsString()
  @MaxLength(150)
  clientName: string;

  @IsEmail()
  @IsOptional()
  clientEmail?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  taxAmount: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalCost: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}

