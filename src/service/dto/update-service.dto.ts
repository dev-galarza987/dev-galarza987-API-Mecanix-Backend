import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto.js';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsNumber({}, { message: 'El id del servicio debe ser un numero' })
  @IsNotEmpty({ message: 'El id del servicio no puede estar vacio' })
  id!: number;

  @IsNotEmpty({ message: 'El title del servicio no puede estar vacio' })
  @IsString({ message: 'El title del servicio debe ser un string' })
  title?: string;

  @IsNotEmpty({ message: 'El description del servicio no puede estar vacio' })
  @IsString({ message: 'El description del servicio debe ser un string' })
  description?: string;

  @IsNotEmpty({ message: 'El price del servicio no puede estar vacio' })
  @IsNumber({}, { message: 'El price del servicio debe ser un numero' })
  price?: number;
}
