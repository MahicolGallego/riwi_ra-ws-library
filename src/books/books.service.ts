import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  create(createLibraryDto: CreateBookDto) {
    return 'This action adds a new library';
  }

  findAll() {
    return `This action returns all library`;
  }

  findOne(id: number) {
    return `This action returns a #${id} library`;
  }

  update(id: number, updateLibraryDto: UpdateBookDto) {
    return `This action updates a #${id} library`;
  }

  remove(id: number) {
    return `This action removes a #${id} library`;
  }
}
