import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto.js';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @IsNotEmpty({ message: 'El campo id es requerido' })
  @IsNumber({}, { message: 'El campo id debe ser un numero' })
  id!: number;

  @IsNotEmpty({ message: 'El campo board es requerido' })
  @IsString({ message: 'El campo board debe ser una cadena de caracteres' })
  board?: string;

  @IsNotEmpty({ message: 'El campo model es requerido' })
  @IsString({ message: 'El campo model debe ser una cadena de caracteres' })
  model?: string;

  @IsNotEmpty({ message: 'El campo brand es requerido' })
  @IsString({ message: 'El campo brand debe ser una cadena de caracteres' })
  brand?: string;

  @IsNotEmpty({ message: 'El campo year es requerido' })
  @IsNumber({}, { message: 'El campo year debe ser un numero' })
  year?: number;
}
