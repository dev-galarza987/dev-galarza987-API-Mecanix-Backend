import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @ApiPropertyOptional({
    description: 'Código único del servicio',
    example: 101,
    minimum: 1
  })
  @IsOptional()
  @IsNumber({}, { message: 'El código del servicio debe ser un número' })
  code?: number;

  @ApiPropertyOptional({
    description: 'Título del servicio',
    example: 'Cambio de aceite premium',
    maxLength: 255
  })
  @IsOptional()
  @IsString({ message: 'El título debe ser un string' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del servicio',
    example: 'Cambio de aceite sintético del motor con filtro de alta calidad',
    maxLength: 500
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Precio del servicio en pesos colombianos',
    example: 180000,
    minimum: 0
  })
  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número' })
  price?: number;
}