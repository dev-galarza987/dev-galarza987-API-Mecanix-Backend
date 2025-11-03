import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReservateDto {
  @ApiProperty({
    description: 'Código del cliente',
    example: 1001,
  })
  @IsNotEmpty({ message: 'El código del cliente es requerido' })
  @IsNumber({}, { message: 'El código del cliente debe ser un número' })
  clientCode: number;

  @ApiProperty({
    description: 'Lista de códigos de servicios a reservar',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray({ message: 'La lista de códigos de servicio debe ser un arreglo' })
  @IsNumber({}, { each: true, message: 'Cada código de servicio debe ser un número' })
  @IsNotEmpty({ message: 'La lista de códigos de servicio es requerida' })
  serviceCodes: number[];

  @ApiPropertyOptional({
    description: 'Fecha de la reserva (si no se proporciona, se usa la fecha y hora actual)',
    example: '2024-01-15T10:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de la reserva debe estar en formato ISO 8601' })
  reservationDate?: Date;

  @ApiPropertyOptional({
    description: 'ID del mecánico asignado a la reserva',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El ID del mecánico debe ser un número' })
  mechanicId?: number;
}