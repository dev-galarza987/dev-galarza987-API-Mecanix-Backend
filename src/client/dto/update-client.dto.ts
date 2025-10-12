import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto.js';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsNotEmpty({ message: 'El campo code es requerido' })
  @IsNumber({}, { message: 'El campo code debe ser un numero' })
  code!: number;

  @IsNotEmpty({ message: 'El campo name es requerido' })
  @IsString({ message: 'El campo name debe ser una cadena de caracteres' })
  name?: string;

  @IsNotEmpty({ message: 'El campo lastname es requerido' })
  @IsString({ message: 'El campo lastname debe ser una cadena de caracteres' })
  lastname?: string;

  @IsNotEmpty({ message: 'El campo phone es requerido' })
  @IsNumber({}, { message: 'El campo phone debe ser un numero' })
  phone?: number;
}
