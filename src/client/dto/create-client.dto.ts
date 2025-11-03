import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, IsEmail, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClientGender } from '../../types/ClientGender';
import { ContactMethod } from '../../types/ContactMethod';

export class CreateClientDto {
  @ApiProperty({
    description: 'Código único del cliente',
    example: 1001,
  })
  @IsNotEmpty({ message: 'El campo código es requerido' })
  @IsNumber()
  code!: number;

  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Juan',
  })
  @IsNotEmpty({ message: 'El campo nombre es requerido' })
  @IsString({ message: 'El campo nombre debe ser una cadena de caracteres' })
  name!: string;

  @ApiProperty({
    description: 'Apellido del cliente',
    example: 'Pérez',
  })
  @IsNotEmpty({ message: 'El campo apellido es requerido' })
  @IsString({ message: 'El campo apellido debe ser una cadena de caracteres' })
  lastname!: string;

  @ApiProperty({
    description: 'Teléfono del cliente',
    example: '1234567890',
  })
  @IsNotEmpty({ message: 'El campo teléfono es requerido' })
  @IsString({ message: 'El campo teléfono debe ser una cadena de caracteres' })
  phone!: string;

  @ApiProperty({
    description: 'Cédula de Identidad del cliente',
    example: 12345678,
  })
  @IsNotEmpty({ message: 'El CI es requerido' })
  @IsNumber({}, { message: 'El CI debe ser un número' })
  ci!: number;

  @ApiProperty({
    description: 'Género del cliente',
    enum: ClientGender,
    example: ClientGender.MALE,
  })
  @IsNotEmpty({ message: 'El género es requerido' })
  @IsEnum(ClientGender, { message: 'El género debe ser MALE o FEMALE' })
  gender!: ClientGender;

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
    example: ContactMethod.PHONE,
  })
  @IsOptional()
  @IsEnum(ContactMethod, { message: 'El método de contacto debe ser phone, email o whatsapp' })
  preferredContactMethod?: ContactMethod;
}
