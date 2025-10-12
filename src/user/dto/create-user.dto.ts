import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El campo código es requerido' })
  @IsNumber({}, { message: 'El campo código debe ser un número' })
  code!: number;

  @IsNotEmpty({ message: 'El campo nombre es requerido' })
  @IsString({ message: 'El campo nombre debe ser una cadena de caracteres' })
  name!: string;

  @IsNotEmpty({ message: 'El campo apellido es requerido' })
  @IsString({ message: 'El campo apellido debe ser una cadena de caracteres' })
  lastname!: string;

  @IsNotEmpty({ message: 'El campo email es requerido' })
  @IsString({ message: 'El campo email debe ser una cadena de caracteres' })
  email!: string;

  @IsNotEmpty({ message: 'El campo contraseña es requerido' })
  @IsString({
    message: 'El campo contraseña debe ser una cadena de caracteres',
  })
  password!: string;
}
