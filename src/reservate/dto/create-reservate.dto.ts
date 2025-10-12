import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReservateDto {
  @IsNotEmpty({ message: 'El campo código es requerido' })
  @IsNumber()
  code!: number;

  @IsNotEmpty({ message: 'El campo título es requerido' })
  @IsString({ message: 'El campo título debe ser una cadena de caracteres' })
  title!: string;

  @IsNotEmpty({ message: 'El campo descripción es requerido' })
  @IsString({
    message: 'El campo descripción debe ser una cadena de caracteres',
  })
  description!: string;
}
