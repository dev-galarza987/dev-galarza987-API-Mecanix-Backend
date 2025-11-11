import { PartialType } from '@nestjs/swagger';
import { CreateVehicleDto } from './create-vehicle.dto';
import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @ApiPropertyOptional({
    description: 'Placa del vehículo',
    example: 'ABC123',
    maxLength: 15,
  })
  @IsOptional()
  @IsString({ message: 'El campo board debe ser una cadena de caracteres' })
  board?: string;

  @ApiPropertyOptional({
    description: 'Modelo del vehículo',
    example: 'Corolla',
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'El campo model debe ser una cadena de caracteres' })
  model?: string;

  @ApiPropertyOptional({
    description: 'Marca del vehículo',
    example: 'Toyota',
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'El campo brand debe ser una cadena de caracteres' })
  brand?: string;

  @ApiPropertyOptional({
    description: 'Año del vehículo',
    example: 2023,
    minimum: 1900,
    maximum: new Date().getFullYear() + 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El campo year debe ser un numero' })
  year?: number;
}
