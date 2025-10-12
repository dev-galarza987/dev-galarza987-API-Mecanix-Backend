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
import { ClientService } from './client.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';

@Controller({ path: 'client/' })
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('create')
  create(@Body() createClient: CreateClientDto) {
    return this.clientService.create(createClient);
  }

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':code')
  findOne(@Param('code', ParseIntPipe) code: number) {
    return this.clientService.findOne(code);
  }

  @Patch(':code/update')
  update(
    @Param('code', ParseIntPipe) code: number,
    @Body() updateClient: UpdateClientDto,
  ) {
    return this.clientService.update(code, updateClient);
  }

  @Delete(':code/delete')
  remove(@Param('code', ParseIntPipe) code: number) {
    return this.clientService.remove(code);
  }
}
