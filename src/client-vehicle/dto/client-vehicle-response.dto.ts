import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClientVehicleResponseDto {
  @ApiProperty({ description: 'ID de la relación', example: 1 })
  id: number;

  @ApiProperty({ description: 'Código del cliente', example: 1001 })
  clientCode: number;

  @ApiProperty({ description: 'ID del vehículo', example: 5 })
  vehicleId: number;

  @ApiProperty({ description: 'Es el vehículo principal', example: true })
  isPrimary: boolean;

  @ApiPropertyOptional({ description: 'Notas sobre la relación', example: 'Vehículo de uso familiar' })
  notes?: string;

  @ApiProperty({ description: 'Cliente aún posee el vehículo', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Fecha de agregado', example: '2025-01-15T10:30:00Z' })
  addedDate: Date;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2025-01-15T10:30:00Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Información del vehículo' })
  vehicle?: {
    id: number;
    board: string;
    model: string;
    brand: string;
    year: number;
  };

  @ApiPropertyOptional({ description: 'Información del cliente' })
  client?: {
    code: number;
    name: string;
    lastname: string;
    phone: string;
  };
}
