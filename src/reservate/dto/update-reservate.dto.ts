import { PartialType } from '@nestjs/mapped-types';
import { CreateReservateDto } from './create-reservate.dto';
import { IsEmpty, IsInt, IsString } from 'class-validator';

export class UpdateReservateDto extends PartialType(CreateReservateDto) {
  @IsEmpty({ message: 'El campo código no puede estar vacio' })
  @IsInt({ message: 'El campo código debe ser un número entero' })
  code!: number;

  @IsEmpty({ message: 'El campo título no puede estar vacio' })
  @IsString({ message: 'El campo título debe ser una cadena de caracteres' })
  title?: string;

  @IsEmpty({ message: 'El campo descripción no puede estar vacio' })
  @IsString({
    message: 'El campo descripción debe ser una cadena de caracteres',
  })
  description?: string;
}
