import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Código único del servicio',
    example: 101,
    minimum: 1
  })
  @IsNotEmpty({ message: 'El code del servicio no puede estar vacio' })
  @IsNumber({}, { message: 'El code del servicio debe ser un numero' })
  code!: number;

  @ApiProperty({
    description: 'Título del servicio',
    example: 'Cambio de aceite',
    maxLength: 255
  })
  @IsNotEmpty({ message: 'El title del servicio no puede estar vacio' })
  @IsString({ message: 'El title del servicio debe ser un string' })
  title!: string;

  @ApiProperty({
    description: 'Descripción detallada del servicio',
    example: 'Cambio de aceite del motor con filtro incluido',
    maxLength: 500,
    required: false
  })
  @IsNotEmpty({ message: 'El description del servicio no puede estar vacio' })
  @IsString({ message: 'El description del servicio debe ser un string' })
  description?: string;

  @ApiProperty({
    description: 'Precio del servicio en pesos colombianos',
    example: 150000,
    minimum: 0
  })
  @IsNotEmpty({ message: 'El price del servicio no puede estar vacio' })
  @IsNumber({}, { message: 'El price del servicio debe ser un numero' })
  price!: number;
}
