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
import { ReservateService } from './reservate.service';
import { CreateReservateDto } from './dto/create-reservate.dto';
import { UpdateReservateDto } from './dto/update-reservate.dto';

@Controller('reservate/')
export class ReservateController {
  constructor(private readonly reservateService: ReservateService) {}

  @Post('create')
  create(@Body() createReservate: CreateReservateDto) {
    return this.reservateService.create(createReservate);
  }

  @Get()
  findAll() {
    return this.reservateService.findAll();
  }

  @Get(':code')
  findOne(@Param('code', ParseIntPipe) code: number) {
    return this.reservateService.findOne(code);
  }

  @Patch(':code/update')
  update(
    @Param('code', ParseIntPipe) code: number,
    @Body() updateReservate: UpdateReservateDto,
  ) {
    return this.reservateService.update(code, updateReservate);
  }

  @Delete(':code/delete')
  remove(@Param('code', ParseIntPipe) code: number) {
    return this.reservateService.remove(code);
  }
}
