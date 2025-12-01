import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from '../client/entities/client.entity.js';
import { Mechanic } from '../mechanic/entities/mechanic.entity.js';
import { UserRole } from '../types/UserRole.js';
import * as adminConfig from '../config/admin.json';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Mechanic)
    private mechanicRepository: Repository<Mechanic>,
    private jwtService: JwtService,
  ) {}

  // ==================== ADMIN METHODS ====================
  
  async loginAdmin(email: string, password: string) {
    console.log('Admin login attempt:', email);
    
    if (email !== adminConfig.email || password !== adminConfig.password) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const { password: _, ...adminData } = adminConfig;
    const payload = { 
      email: adminData.email, 
      sub: adminData.email, 
      role: adminData.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: adminData,
    };
  }

  // ==================== CLIENT METHODS ====================

  async validateClient(email: string): Promise<boolean> {
    const client = await this.clientRepository.findOne({ where: { email } });
    return !!client;
  }

  async signupClient(clientData: any): Promise<Partial<Client>> {
    console.log('Client signup:', clientData.email);

    // Validate if client already exists
    const existingClient = await this.validateClient(clientData.email);
    if (existingClient) {
      throw new ConflictException('Client with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(clientData.password, 10);

    // Create new client
    const newClient = this.clientRepository.create({
      ...clientData,
      password: hashedPassword,
      type: UserRole.CLIENT,
    });

    const savedClient = (await this.clientRepository.save(newClient)) as unknown as Client;
    
    // Remove password from response
    const { password, ...result } = savedClient;
    return result;
  }

  async loginClient(email: string, password: string) {
    console.log('Client login attempt:', email);

    const client = await this.clientRepository.findOne({ where: { email } });
    
    if (!client) {
      throw new UnauthorizedException('Invalid client credentials');
    }

    if (!client.password) {
      throw new UnauthorizedException('Client has no password set');
    }

    const isPasswordValid = await bcrypt.compare(password, client.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password Invalid client credentials');
    }

    const { password: _, ...clientData } = client;
    const payload = { 
      email: clientData.email, 
      sub: clientData.id, 
      role: UserRole.CLIENT 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: { ...clientData, role: UserRole.CLIENT },
    };
  }

  // ==================== MECHANIC METHODS ====================

  async validateMechanic(identifier: string): Promise<boolean> {
    // Validate by email or employeeCode
    const mechanic = await this.mechanicRepository.findOne({ 
      where: [
        { email: identifier },
        { employeeCode: identifier }
      ]
    });
    return !!mechanic;
  }

  async signupMechanic(mechanicData: any): Promise<Partial<Mechanic>> {
    console.log('Mechanic signup:', mechanicData.email || mechanicData.employeeCode);

    // Validate if mechanic already exists (by email or employeeCode)
    if (mechanicData.email) {
      const existingByEmail = await this.mechanicRepository.findOne({
        where: { email: mechanicData.email }
      });
      if (existingByEmail) {
        throw new ConflictException('Mechanic with this email already exists');
      }
    }

    const existingByCode = await this.mechanicRepository.findOne({
      where: { employeeCode: mechanicData.employeeCode }
    });
    if (existingByCode) {
      throw new ConflictException('Mechanic with this employee code already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(mechanicData.password, 10);

    // Prepare mechanic data
    const dataToSave: any = {
      ...mechanicData,
      password: hashedPassword,
      type: UserRole.MECHANIC,
    };

    // Convert hireDate string to Date if present
    if (dataToSave.hireDate && typeof dataToSave.hireDate === 'string') {
      dataToSave.hireDate = new Date(dataToSave.hireDate);
    }

    // Create new mechanic
    const newMechanic = this.mechanicRepository.create(dataToSave);
    const savedMechanic = (await this.mechanicRepository.save(newMechanic)) as unknown as Mechanic;
    
    // Remove password from response
    const { password, ...result } = savedMechanic;
    return result;
  }

  async loginMechanic(identifier: string, password: string) {
    console.log('Mechanic login attempt:', identifier);

    // Try to find by email first, then by employeeCode
    const mechanic = await this.mechanicRepository.findOne({ 
      where: [
        { email: identifier },
        { employeeCode: identifier }
      ]
    });
    
    if (!mechanic) {
      throw new UnauthorizedException('Invalid mechanic credentials');
    }

    if (!mechanic.password) {
      throw new UnauthorizedException('Mechanic has no password set');
    }

    const isPasswordValid = await bcrypt.compare(password, mechanic.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid mechanic credentials');
    }

    const { password: _, ...mechanicData } = mechanic;
    const payload = { 
      email: mechanicData.email || mechanicData.employeeCode, 
      sub: mechanicData.id, 
      role: UserRole.MECHANIC 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: { ...mechanicData, role: UserRole.MECHANIC },
    };
  }

  // ==================== LEGACY METHODS (for backward compatibility) ====================

  async validateUser(email: string, pass: string): Promise<any> {
    console.log('Validating user:', email);
    
    // 1. Check Admin
    if (email === adminConfig.email) {
      if (pass === adminConfig.password) {
        const { password, ...result } = adminConfig;
        return result;
      }
      return null;
    }

    // 2. Check Client
    try {
      const client = await this.clientRepository.findOne({ where: { email } });
      if (client && client.password && await bcrypt.compare(pass, client.password)) {
        const { password, ...result } = client;
        return { ...result, role: UserRole.CLIENT };
      }
    } catch (e) {
      console.error('Error checking client:', e);
    }

    // 3. Check Mechanic
    try {
      const mechanic = await this.mechanicRepository.findOne({ 
        where: { employeeCode: email } 
      });
      if (mechanic && mechanic.password && await bcrypt.compare(pass, mechanic.password)) {
        const { password, ...result } = mechanic;
        return { ...result, role: UserRole.MECHANIC };
      }
    } catch (e) {
      console.error('Error checking mechanic:', e);
    }
    
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email || user.employeeCode, 
      sub: user.id || user.email, 
      role: user.role || user.type 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(registerDto: any) {
    const { role } = registerDto;

    if (role === UserRole.CLIENT || role === 'client') {
      return this.signupClient(registerDto);
    } else if (role === UserRole.MECHANIC || role === 'mechanic') {
      return this.signupMechanic(registerDto);
    } else {
      throw new UnauthorizedException('Invalid role for registration');
    }
  }
}
