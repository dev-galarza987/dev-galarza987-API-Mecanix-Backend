import { PartialType } from '@nestjs/swagger';
import { CreateReservateDto } from './create-reservate.dto';
import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StateReservate } from '../../types/StateReservate';

export class UpdateReservateDto extends PartialType(CreateReservateDto) {
  @ApiPropertyOptional({
    description: 'Nuevo estado de la reserva',
    enum: StateReservate,
    example: StateReservate.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(StateReservate, { message: 'El estado debe ser un valor válido' })
  state?: StateReservate;

  @ApiPropertyOptional({
    description: 'Nuevo precio total de la reserva',
    example: 150.50,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El precio total debe ser un número' })
  totalPrice?: number;

  @ApiPropertyOptional({
    description: 'ID del mecánico a asignar o reasignar',
    example: 2,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El ID del mecánico debe ser un número' })
  mechanicId?: number;
}
