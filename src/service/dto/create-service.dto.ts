import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty({ message: 'El code del servicio no puede estar vacio' })
  @IsNumber({}, { message: 'El code del servicio debe ser un numero' })
  code!: number;

  @IsNotEmpty({ message: 'El title del servicio no puede estar vacio' })
  @IsString({ message: 'El title del servicio debe ser un string' })
  title!: string;

  @IsNotEmpty({ message: 'El description del servicio no puede estar vacio' })
  @IsString({ message: 'El description del servicio debe ser un string' })
  description?: string;

  @IsNotEmpty({ message: 'El price del servicio no puede estar vacio' })
  @IsNumber({}, { message: 'El price del servicio debe ser un numero' })
  price!: number;
}
