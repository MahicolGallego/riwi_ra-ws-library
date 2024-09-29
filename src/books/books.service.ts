import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { format } from '@formkit/tempo';
import { ErrorManager } from 'src/common/filters/error-manage.filter';

// Mark the UsersService class as injectable, allowing it to be used in other classes
@Injectable()
export class BooksService {
  //inject dependencies through the constructor
  constructor(
    @InjectRepository(Book) private readonly booksService: Repository<Book>,
  ) {}

  async create(createLibraryDto: CreateBookDto) {
    try {
      // Create a new user instance
      const newBook = this.booksService.create(createLibraryDto);
      // Save the new book to the database
      const savedNewBook = await this.booksService.save(newBook);

      // Book with publish_date in 'dd-MMM-yyyy' format
      const bookForResponse = {
        isbn: savedNewBook.isbn,
        author: savedNewBook.author,
        title: savedNewBook.title,
        gender: savedNewBook.gender,
        // Convert the publish_date to 'dd-MMM-yyyy' format using the format function from @formkit/tempo
        publish_date: format(savedNewBook.publish_date, 'short'),
      };

      return bookForResponse;
    } catch (error) {
      // If an error occurs, throw a signature error using the custom ErrorManager
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('an unexpected error occurred');
    }
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
