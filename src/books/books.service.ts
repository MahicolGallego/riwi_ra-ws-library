import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { format } from '@formkit/tempo';
import { ErrorManager } from 'src/common/filters/error-manage.filter';
import { FindLeakedBooksDto } from './dto/find-leaked-books.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

// Mark the UsersService class as injectable, allowing it to be used in other classes
@Injectable()
export class BooksService {
  //inject dependencies through the constructor
  constructor(
    @InjectRepository(Book) private readonly booksRepository: Repository<Book>,
    @InjectPinoLogger(BooksService.name) private readonly logger: PinoLogger,
    // Se especifica el name de la clase para registrar tambien el contexto desde donde llega el log
  ) {}

  async create(createBookDto: CreateBookDto) {
    try {
      this.logger.info('Creating a new book', createBookDto);
      // Check if a book with the same ISBN already exists
      const existingBook = await this.findOneByISBN(createBookDto.isbn);

      if (existingBook) {
        this.logger.warn(`Book with ISBN ${createBookDto.isbn} already exists`);
        throw new ErrorManager({
          type: 'CONFLICT',
          message: 'El libro ya existe con ese ISBN.',
        });
      }

      // Create a new user instance
      const newBook = this.booksRepository.create(createBookDto);
      // Save the new book to the database
      const savedNewBook = await this.booksRepository.save(newBook);

      this.logger.info('New book created successfully', savedNewBook);

      // Book with publish_date in 'dd-MMM-yyyy' format
      const bookForResponse = this.formatBookForResponse(savedNewBook);

      return bookForResponse;
    } catch (error) {
      this.logger.error('Error creating a book', error);
      // If an error occurs, throw a signature error using the custom ErrorManager
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('an unexpected error occurred');
    }
  }

  async findOneByISBN(isbn: string): Promise<Book> {
    this.logger.debug(`Finding book with ISBN: ${isbn}`);
    return await this.booksRepository.findOne({ where: { isbn } });
  }

  async findAllLeakedBooks(params: FindLeakedBooksDto, page: number) {
    try {
      this.logger.info('Finding leaked books', { params, page });

      // find all leaked books use the params provided
      const [items, total] = await this.booksRepository.findAndCount({
        where: { ...params },
        skip: page ? (page - 1) * 5 : 0,
        take: 5,
      });
      //

      if (!items) {
        this.logger.warn('No books found with the given parameters');
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message:
            'There are not books in the database with parameters provided',
        });
      }

      const last_page = Math.ceil(total / 5);

      // if requested page > last page ERROR with summary for inform to the client
      if (page > last_page) {
        this.logger.warn(
          `Page out of range: requested page ${page}, last page ${last_page}`,
        );
        throw new BadRequestException({
          type: 'BAD_REQUEST',
          message: `Requested page ${page} is out of range. Total books: ${total}. Last page: ${last_page}. Select a page in range of results.`,
        });
      }

      this.logger.debug('Books found', { items, total });

      // format books for response
      const formattedItems = items.map((book) =>
        this.formatBookForResponse(book),
      );

      return {
        books: formattedItems, // format books for response
        total, // total found books
        page: page ? page : 1, // Corresponding page
        last_page, // inform what is the last page
      };
    } catch (error) {
      this.logger.error('Error finding leaked books', error);
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }

  async findOne(isbn: string): Promise<Book> {
    try {
      this.logger.debug(`Finding book with ISBN: ${isbn}`);
      const book = await this.booksRepository.findOne({ where: { isbn } });
      if (!book) {
        this.logger.warn(`Book not found with ISBN: ${isbn}`);
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Book not found with the provided ISBN.',
        });
      }

      this.logger.info(`Book found: ${isbn}`);
      return book;
    } catch (error) {
      this.logger.error('Error finding book', error);
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }

  async update(isbn: string, updateBookDto: UpdateBookDto): Promise<object> {
    {
      try {
        this.logger.info(`Updating book with ISBN: ${isbn}`, updateBookDto);
        // Query with deleteAt = null to avoid responses with soft deletes
        const results = await this.booksRepository.update(
          { isbn, deletedAt: null },
          updateBookDto,
        );

        if (results.affected === 0) {
          this.logger.warn(`Book not found with ISBN: ${isbn}`);
          throw new ErrorManager({
            type: 'NOT_FOUND',
            message: 'Book not found with the provided ISBN.',
          });
        }

        this.logger.info(`Book with ISBN: ${isbn} updated successfully`);

        return {
          success: 'true',
          message: 'Book updated successfully.',
        };
      } catch (error) {
        this.logger.error('Error updating book', error);
        throw error instanceof Error
          ? ErrorManager.createSignatureError(error.message)
          : ErrorManager.createSignatureError('An unexpected error occurred');
      }
    }
  }

  async remove(isbn: string): Promise<object | void> {
    try {
      this.logger.info(`Removing book with ISBN: ${isbn}`);
      // Find the book cause soft delete requires an instance of the class
      const book = await this.booksRepository.findOne({ where: { isbn } });

      if (!book) {
        this.logger.warn(`Book not found with ISBN: ${isbn}`);
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Book not found with the provided ISBN.',
        });
      }

      // Soft delete: set the 'deletedAt' flag, logical delete
      await this.booksRepository.softRemove(book);

      this.logger.info(
        `Book with ISBN: ${isbn} marked as deleted successfully`,
      );

      return {
        success: 'true',
        message: 'Book marked as deleted successfully.',
      };
    } catch (error) {
      this.logger.error('Error removing book', error);
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : ErrorManager.createSignatureError('An unexpected error occurred');
    }
  }

  formatBookForResponse(savedBook: Book) {
    return {
      isbn: savedBook.isbn,
      author: savedBook.author,
      title: savedBook.title,
      genre: savedBook.genre,
      publish_date: format(savedBook.publish_date, 'short'),
    };
  }
}
