import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUser: CreateUserDto): Promise<void> {
    try {
      const newUser = this.userRepository.create(createUser);
      await this.userRepository.save(newUser);
    } catch (error) {
      console.error(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return this.userRepository.find();
    } catch (error) {
      console.error(error);
      return Promise.resolve([]);
    }
  }

  async findOne(code: number): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { code } });
    } catch (error) {
      console.error(error);
      return Promise.resolve(null);
    }
  }

  async update(code: number, updateUser: UpdateUserDto): Promise<void> {
    try {
      await this.userRepository.update({ code }, updateUser);
    } catch (error) {
      console.error(error);
    }
  }

  async remove(code: number): Promise<void> {
    try {
      await this.userRepository.delete({ code });
    } catch (error) {
      console.error(error);
    }
  }
}
