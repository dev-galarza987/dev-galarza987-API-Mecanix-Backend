import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Placa del vehículo',
    example: 'ABC123',
    maxLength: 15,
  })
  @IsNotEmpty({ message: 'La board del vehiculo no puede estar vacio' })
  @IsString({ message: 'La board del vehiculo debe ser un string' })
  board: string;

  @ApiProperty({
    description: 'Modelo del vehículo',
    example: 'Corolla',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'El model del vehiculo no puede estar vacio' })
  @IsString({ message: 'El model del vehiculo debe ser un string' })
  model: string;

  @ApiProperty({
    description: 'Marca del vehículo',
    example: 'Toyota',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'La brand del vehiculo no puede estar vacio' })
  @IsString({ message: 'La brand del vehiculo debe ser un string' })
  brand: string;

  @ApiProperty({
    description: 'Año del vehículo',
    example: 2023,
    minimum: 1900,
    maximum: new Date().getFullYear() + 1,
  })
  @IsNotEmpty({ message: 'El year del vehiculo no puede estar vacio' })
  @IsNumber({}, { message: 'El year del vehiculo debe ser un numero' })
  year: number;
}
