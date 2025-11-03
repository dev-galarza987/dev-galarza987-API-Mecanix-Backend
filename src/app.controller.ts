import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHomePage() {
    return {
      title: 'API Mecanix Backend',
      description: 'API REST completa para la gestión integral de talleres mecánicos. Administra usuarios, clientes, vehículos, servicios y reservas con una arquitectura moderna y escalable.',
      version: process.env.API_VERSION || 'v1',
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3000,
      year: new Date().getFullYear(),
      baseUrl: `http://localhost:${process.env.PORT || 3000}`,
      stats: {
        endpoints: 30,
        requests: 1247,
        uptime: 99.8,
        responseTime: 145
      },
      endpoints: [
        {
          name: 'Usuarios',
          description: 'Gestión completa de usuarios del sistema con autenticación y roles.',
          path: `/api/${process.env.API_VERSION || 'v1'}/user`,
          icon: '👥'
        },
        {
          name: 'Clientes',
          description: 'Administración de clientes con historial y datos de contacto.',
          path: `/api/${process.env.API_VERSION || 'v1'}/client`,
          icon: '👤'
        },
        {
          name: 'Vehículos',
          description: 'Registro y seguimiento de vehículos con historial de servicios.',
          path: `/api/${process.env.API_VERSION || 'v1'}/vehicle`,
          icon: '🚗'
        },
        {
          name: 'Servicios',
          description: 'Catálogo de servicios mecánicos con precios y duración.',
          path: `/api/${process.env.API_VERSION || 'v1'}/service`,
          icon: '🔧'
        },
        {
          name: 'Reservas',
          description: 'Sistema de reservas con programación inteligente de citas.',
          path: `/api/${process.env.API_VERSION || 'v1'}/reservate`,
          icon: '📅'
        },
        {
          name: 'Mecánicos',
          description: 'Gestión de mecánicos con especialidades y horarios de trabajo.',
          path: `/api/${process.env.API_VERSION || 'v1'}/mechanic`,
          icon: '👨‍🔧'
        }
      ]
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.API_VERSION || 'v1'
    };
  }
}
