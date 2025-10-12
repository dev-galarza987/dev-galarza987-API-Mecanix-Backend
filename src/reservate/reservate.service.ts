import { Injectable } from '@nestjs/common';
import { CreateReservateDto } from './dto/create-reservate.dto';
import { UpdateReservateDto } from './dto/update-reservate.dto';

@Injectable()
export class ReservateService {
  create(createReservate: CreateReservateDto) {
    return 'This action adds a new reservate';
  }

  findAll() {
    return `This action returns all reservate`;
  }

  findOne(id: number) {
    return `This action returns a #${code} reservate`;
  }

  update(id: number, updateReservate: UpdateReservateDto) {
    return `This action updates a #${code} reservate`;
  }

  remove(id: number) {
    return `This action removes a #${code} reservate`;
  }
}
