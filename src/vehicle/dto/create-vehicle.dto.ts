import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty({ message: 'La board del vehiculo no puede estar vacio' })
  @IsString({ message: 'La board del vehiculo debe ser un string' })
  board: string;

  @IsNotEmpty({ message: 'El model del vehiculo no puede estar vacio' })
  @IsString({ message: 'El model del vehiculo debe ser un string' })
  model: string;

  @IsNotEmpty({ message: 'La brand del vehiculo no puede estar vacio' })
  @IsString({ message: 'La brand del vehiculo debe ser un string' })
  brand: string;

  @IsNotEmpty({ message: 'El year del vehiculo no puede estar vacio' })
  @IsNumber({}, { message: 'El year del vehiculo debe ser un numero' })
  year: number;
}
