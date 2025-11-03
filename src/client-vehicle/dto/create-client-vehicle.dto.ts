import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClientVehicleDto {
  @ApiProperty({
    description: 'Código del cliente',
    example: 1001,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  clientCode: number;

  @ApiProperty({
    description: 'ID del vehículo',
    example: 5,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  vehicleId: number;

  @ApiPropertyOptional({
    description: 'Indica si este es el vehículo principal del cliente',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la relación cliente-vehículo',
    example: 'Vehículo de uso familiar',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({
    description: 'Indica si el cliente aún posee este vehículo',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
