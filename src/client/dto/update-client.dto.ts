import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto.js';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsBoolean,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClientGender } from 'src/types/ClientGender';
import { ContactMethod } from 'src/types/ContactMethod';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiProperty({
    description: 'Código único del cliente',
    example: 1001,
  })
  @IsNotEmpty({ message: 'El campo code es requerido' })
  @IsNumber({}, { message: 'El campo code debe ser un numero' })
  code!: number;

  @ApiPropertyOptional({
    description: 'Nombre del cliente',
    example: 'Juan',
  })
  @IsOptional()
  @IsString({ message: 'El campo name debe ser una cadena de caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Apellido del cliente',
    example: 'Pérez',
  })
  @IsOptional()
  @IsString({ message: 'El campo lastname debe ser una cadena de caracteres' })
  lastname?: string;

  @ApiPropertyOptional({
    description: 'Teléfono del cliente',
    example: '1234567890',
  })
  @IsOptional()
  @IsString({ message: 'El campo phone debe ser una cadena de caracteres' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Cédula de Identidad del cliente',
    example: 12345678,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El CI debe ser un número' })
  ci?: number;

  @ApiPropertyOptional({
    description: 'Género del cliente',
    enum: ClientGender,
    example: ClientGender.FEMALE,
  })
  @IsOptional()
  @IsEnum(ClientGender, { message: 'El género debe ser MALE o FEMALE' })
  gender?: ClientGender;

  @ApiPropertyOptional({
    description: 'Email del cliente',
    example: 'juan.perez@email.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Contraseña del cliente (mínimo 8 caracteres)',
    example: 'Contraseña123!',
  })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de caracteres' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Dirección del cliente',
    example: 'Av. Principal 123, Ciudad',
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de caracteres' })
  address?: string;

  @ApiPropertyOptional({
    description: 'Método de contacto preferido',
    enum: ContactMethod,
    example: ContactMethod.EMAIL,
  })
  @IsOptional()
  @IsEnum(ContactMethod, {
    message: 'El método de contacto debe ser phone, email o whatsapp',
  })
  preferredContactMethod?: ContactMethod;

  @ApiPropertyOptional({
    description: 'Estado activo del cliente',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser verdadero o falso' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Estado de verificación del email',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'emailVerified debe ser verdadero o falso' })
  emailVerified?: boolean;

  @ApiPropertyOptional({
    description: 'Estado de verificación del teléfono',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'phoneVerified debe ser verdadero o falso' })
  phoneVerified?: boolean;
}
