import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { format } from '@formkit/tempo';
import { ErrorManager } from 'src/common/filters/error-manage.filter';
import { FindLeakedBooksDto } from './dto/find-leaked-books.dto';

// Mark the UsersService class as injectable, allowing it to be used in other classes
@Injectable()
export class BooksService {
  //inject dependencies through the constructor
  constructor(
    @InjectRepository(Book) private readonly booksRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    try {
      // Check if a book with the same ISBN already exists
      const existingBook = await this.findOneByISBN(createBookDto.isbn);

      if (existingBook) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: 'El libro ya existe con ese ISBN.',
        });
      }

      // Create a new user instance
      const newBook = this.booksRepository.create(createBookDto);
      // Save the new book to the database
      const savedNewBook = await this.booksRepository.save(newBook);

      // Book with publish_date in 'dd-MMM-yyyy' format
      const bookForResponse = this.formatBookForResponse(savedNewBook);

      return bookForResponse;
    } catch (error) {
      // If an error occurs, throw a signature error using the custom ErrorManager
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('an unexpected error occurred');
    }
  }

  async findOneByISBN(isbn: string): Promise<Book> {
    return await this.booksRepository.findOne({ where: { isbn } });
  }

  async findAllLeakedBooks(params: FindLeakedBooksDto, page: number) {
    try {
      console.log('params', params);
      // find all leaked books use the params provided
      const [items, total] = await this.booksRepository.findAndCount({
        where: { ...params },
        skip: page ? (page - 1) * 5 : 0,
        take: 5,
      });
      //

      if (!items)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message:
            'There are not books in the database with parameters provided',
        });

      // format books for response
      const formattedItems = items.map((book) =>
        this.formatBookForResponse(book),
      );

      return {
        books: formattedItems, // format books for response
        total, // total found books
        page: page ? page : 1, // Corresponding page
        last_page: Math.ceil(total / 5), // inform what is the last page
      };
    } catch (error) {
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : ErrorManager.createSignatureError('An unexpected error occurred');
    }
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

  formatBookForResponse(savedBook: Book) {
    return {
      isbn: savedBook.isbn,
      author: savedBook.author,
      title: savedBook.title,
      gender: savedBook.gender,
      publish_date: format(savedBook.publish_date, 'short'),
    };
  }
}
