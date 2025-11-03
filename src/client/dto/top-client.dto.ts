import { ApiProperty } from '@nestjs/swagger';

export class TopClientDto {
  @ApiProperty({
    description: 'Código del cliente',
    example: 1001,
  })
  code: number;

  @ApiProperty({
    description: 'Nombre completo del cliente',
    example: 'Juan Pérez',
  })
  fullName: string;

  @ApiProperty({
    description: 'Email del cliente',
    example: 'juan.perez@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Teléfono del cliente',
    example: '1234567890',
  })
  phone: string;

  @ApiProperty({
    description: 'Total de reservaciones',
    example: 25,
  })
  totalReservations: number;

  @ApiProperty({
    description: 'Total gastado',
    example: 7500.00,
  })
  totalSpent: number;

  @ApiProperty({
    description: 'Fecha de última visita',
    example: '2025-11-01T15:30:00Z',
  })
  lastVisit: Date;
}
