import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClientStatisticsDto {
  @ApiProperty({
    description: 'Código del cliente',
    example: 1001,
  })
  clientCode: number;

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
    description: 'Total de reservaciones realizadas',
    example: 15,
  })
  totalReservations: number;

  @ApiProperty({
    description: 'Reservaciones completadas',
    example: 12,
  })
  completedReservations: number;

  @ApiProperty({
    description: 'Reservaciones pendientes',
    example: 2,
  })
  pendingReservations: number;

  @ApiProperty({
    description: 'Reservaciones en progreso',
    example: 1,
  })
  inProgressReservations: number;

  @ApiProperty({
    description: 'Monto total gastado',
    example: 4500.50,
  })
  totalSpent: number;

  @ApiPropertyOptional({
    description: 'Fecha de la última reservación',
    example: '2025-10-15T10:30:00Z',
  })
  lastReservationDate?: Date;

  @ApiPropertyOptional({
    description: 'Fecha de la primera reservación',
    example: '2024-01-10T14:20:00Z',
  })
  firstReservationDate?: Date;

  @ApiProperty({
    description: 'Promedio de gasto por reservación',
    example: 300.03,
  })
  averageSpentPerReservation: number;

  @ApiProperty({
    description: 'Servicios más solicitados',
    example: ['Cambio de aceite', 'Revisión de frenos', 'Alineación'],
    type: [String],
  })
  topServices: string[];

  @ApiProperty({
    description: 'Fecha de registro del cliente',
    example: '2023-12-01T08:00:00Z',
  })
  registrationDate: Date;

  @ApiProperty({
    description: 'Cliente activo',
    example: true,
  })
  isActive: boolean;
}
