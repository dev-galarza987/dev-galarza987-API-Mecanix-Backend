import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('user/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':code')
  findOne(@Param('code', ParseIntPipe) code: number) {
    return this.userService.findOne(code);
  }

  @Patch(':code/update')
  update(
    @Param('code', ParseIntPipe) code: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(code, updateUserDto);
  }

  @Delete(':code/delete')
  remove(@Param('code', ParseIntPipe) code: number) {
    return this.userService.remove(code);
  }
}
