import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateReservateDto {
  @IsNotEmpty({ message: 'El código del cliente es requerido' })
  @IsNumber({}, { message: 'El código del cliente debe ser un número' })
  clientCode: number;

  @IsArray({ message: 'La lista de códigos de servicio debe ser un arreglo' })
  @IsNumber({}, { each: true, message: 'Cada código de servicio debe ser un número' })
  @IsNotEmpty({ message: 'La lista de códigos de servicio es requerida' })
  serviceCodes: number[];

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de la reserva debe estar en formato ISO 8601' })
  reservationDate: Date;
}