import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty({ message: 'El campo código es requerido' })
  @IsNumber()
  code!: number;

  @IsNotEmpty({ message: 'El campo nombre es requerido' })
  @IsString({ message: 'El campo nombre debe ser una cadena de caracteres' })
  name!: string;

  @IsNotEmpty({ message: 'El campo apellido es requerido' })
  @IsString({ message: 'El campo apellido debe ser una cadena de caracteres' })
  lastname!: string;

  @IsNotEmpty({ message: 'El campo teléfono es requerido' })
  @IsNumber()
  phone!: number;
}
