import { PaymentMethod } from '../../types/PaymentMethod';

/**
 * DTO para enviar datos de orden a Factus (Sistema de Facturación Electrónica)
 */
export class OrderToFactusDto {
  // Información de la orden
  orderCode: string;
  orderDate: Date;

  // Información del cliente
  client: {
    nitCi: number;
    name: string;
    email?: string;
  };

  // Detalle de servicios
  services: Array<{
    serviceId: number;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;

  // Totales
  subtotal: number;
  taxAmount: number; // IVA 13%
  totalCost: number;

  // Información adicional
  paymentMethod: PaymentMethod;
  vehicleInfo?: {
    board: string;
    brand: string;
    model: string;
  };
}
