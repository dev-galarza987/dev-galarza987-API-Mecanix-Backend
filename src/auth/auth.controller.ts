import { Controller, Post, UseGuards, Request, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { Public } from './decorators/public.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    console.log('AuthController initialized');
  }

  // ==================== ADMIN ENDPOINTS ====================
  @Post('admin/signin')
  async adminLogin(@Body() loginDto: { email: string; password: string }) {
    return this.authService.loginAdmin(loginDto.email, loginDto.password);
  }

  // ==================== CLIENT ENDPOINTS ====================
  @Post('client/signin')
  async clientLogin(@Body() loginDto: { email: string; password: string }) {
    return this.authService.loginClient(loginDto.email, loginDto.password);
  }

  @Post('client/signup')
  async clientSignup(@Body() registerDto: any) {
    return this.authService.signupClient(registerDto);
  }

  // ==================== MECHANIC ENDPOINTS ====================
  @Post('mechanic/signin')
  async mechanicLogin(@Body() loginDto: { email: string; password: string }) {
    // For mechanics, 'email' field contains the employeeCode
    return this.authService.loginMechanic(loginDto.email, loginDto.password);
  }

  @Post('mechanic/signup')
  async mechanicSignup(@Body() registerDto: any) {
    return this.authService.signupMechanic(registerDto);
  }

  // ==================== GENERIC ENDPOINTS (Legacy) ====================
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Get('test')
  test() {
    return 'Auth Controller is working';
  }

  @Post('signup')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }
}
