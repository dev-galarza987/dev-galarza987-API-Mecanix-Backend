import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
// import { UserRole } from 'src/types/UserRole.js';
import { UserRole } from '../../types/UserRole.js';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({ message: 'El campo código es requerido' })
  @IsNumber({}, { message: 'El campo código debe ser un número' })
  code?: number;

  @IsNotEmpty({ message: 'El campo nombre es requerido' })
  @IsString({ message: 'El campo nombre debe ser una cadena de caracteres' })
  name?: string;

  @IsNotEmpty({ message: 'El campo apellido es requerido' })
  @IsString({ message: 'El campo apellido debe ser una cadena de caracteres' })
  lastname?: string;

  @IsNotEmpty({ message: 'El campo email es requerido' })
  @IsString({ message: 'El campo email debe ser una cadena de caracteres' })
  email?: string;

  @IsNotEmpty({ message: 'El campo contraseña es requerido' })
  @IsString({
    message: 'El campo contraseña debe ser una cadena de caracteres',
  })
  password?: string;

  @IsNotEmpty({ message: 'El campo estado es requerido' })
  @IsBoolean({ message: 'El campo estado debe ser un valor booleano' })
  isActive?: boolean;

  @IsNotEmpty({ message: 'El campo rol es requerido' })
  @IsString({
    message: 'El campo rol debe ser una cadena enumerable de caracteres',
  })
  role?: UserRole;
}
