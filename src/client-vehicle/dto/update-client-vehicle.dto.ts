import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateClientVehicleDto } from './create-client-vehicle.dto';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateClientVehicleDto extends PartialType(CreateClientVehicleDto) {
  @ApiPropertyOptional({
    description: 'Indica si este es el vehículo principal del cliente',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la relación cliente-vehículo',
    example: 'Vehículo vendido',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({
    description: 'Indica si el cliente aún posee este vehículo',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
