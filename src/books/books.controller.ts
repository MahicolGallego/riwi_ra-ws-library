import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Book } from './entities/book.entity';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { AuthorizationGuard } from 'src/permissions/guards/authorization.guard';
import { Rbac } from 'src/common/decorators/rbac.decorator';
import { FindLeakedBooksDto } from './dto/find-leaked-books.dto';

@ApiTags('books')
@ApiBearerAuth() // Swagger documentation, Indicates that all endpoints in this controller require an API key in the headers for authentication
@UseGuards(ApiKeyGuard) // Applies API key authentication guard to all endpoints in this controller
@Controller('books')
export class BooksController {
  //inject dependencies through the constructor
  constructor(private readonly booksService: BooksService) {}

  // Define a POST endpoint for create book
  // Apply RBAC AUTHORIZATION
  @Rbac(['admin'], 'write', 'books')
  @UseGuards(AuthorizationGuard)
  @Post()
  // Endpoint documentation with swagger
  @ApiOperation({
    summary: 'Register a new book',
    description:
      'Register a new books. isbn, author, title, gender and publish date are required',
  })
  @ApiBody({
    type: [CreateBookDto],
  })
  @ApiOkResponse({
    description: 'ok',
    type: Book,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request, validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'isbn must be a string',
          'isbn must be a valid 10 or 13 format',
          'author must be a string',
          'The author must have between 3 and 50 letters',
          'title must be a string',
          'The title must have between 3 and 50 letters',
          'gender must be a string',
          'The gender must have between 3 and 20 letters',
          'publish date must be a Date instance',
        ],
        error: 'Bad Request',
      },
    },
  })
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.booksService.create(createBookDto);
  }

  @Rbac(['admin', 'user'], 'read', 'books')
  @UseGuards(AuthorizationGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all books with filter options',
    description:
      'Retrieve all books filtered by author, genre, and publish date, with pagination support',
  })
  @ApiQuery({
    name: 'author',
    required: false,
    description: 'Filter books by author name.',
    type: String,
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    description: 'Filter books by genre.',
    type: String,
  })
  @ApiQuery({
    name: 'publish_date',
    required: false,
    description: 'Filter books by publication date. format YYYY-MM-DD',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination (default is 1).',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'A list of books matching the provided filters.',
    schema: {
      example: {
        books: [
          {
            id: 1,
            title: 'Example Book Title',
            author: 'Author Name',
            genre: 'Genre Name',
            publish_date: '2023-01-01',
          },
          // ... more book examples
        ],
        total: 10,
        page: 1,
        last_page: 2,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Requested page number is out of range.',
    schema: {
      example: {
        message:
          'Requested page 3 is out of range. Total books: 10. Last page: 2. Select a page in range of results.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No books found matching the provided filters.',
    schema: {
      example: {
        message: 'There are no books in the database with parameters provided',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred.',
    schema: {
      example: {
        message: 'An unexpected error occurred',
      },
    },
  })
  async findAllBooks(
    @Query('author') author: string,
    @Query('genre') genre: string,
    @Query('publish_date') publish_date: Date,
    @Query('page') page: number,
  ) {
    const findLeakedBooksDto: FindLeakedBooksDto = {
      author,
      genre,
      publish_date,
    };
    return await this.booksService.findAllLeakedBooks(findLeakedBooksDto, page);
  }

  @Rbac(['admin', 'user'], 'read', 'books')
  @UseGuards(AuthorizationGuard)
  @Get(':sbn')
  @ApiOperation({
    summary: 'Get a book by ISBN',
    description:
      'Retrieve a single book using its ISBN. Throws an error if not found.',
  })
  @ApiParam({
    name: 'isbn',
    required: true,
    description: 'The ISBN of the book to retrieve.',
    type: String,
  })
  @ApiOkResponse({
    description: 'The book found successfully.',
    schema: {
      example: {
        isbn: '978-3-16-148410-0',
        title: 'Example Book Title',
        author: 'Author Name',
        genre: 'Genre Name',
        publish_date: '2023-01-01',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Book not found with the provided ISBN.',
    schema: {
      example: {
        message: 'Book not found with the provided ISBN.',
      },
    },
  })
  findOne(@Param('isbn') isbn: string) {
    return this.booksService.findOne(isbn);
  }

  @Rbac(['admin'], 'update', 'books')
  @UseGuards(AuthorizationGuard)
  @Patch(':isbn')
  @ApiOperation({
    summary: 'update a book by ISBN',
    description:
      'update book data using its ISBN. Throws an error if not found.',
  })
  @ApiParam({
    name: 'isbn',
    required: true,
    description: 'The ISBN of the book to update.',
    type: String,
  })
  @ApiOkResponse({
    description: 'Book updated successfully.',
    schema: {
      example: {
        success: 'true',
        message: 'Book updated successfully.',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'book not found with the provided isbn',
    schema: {
      example: {
        message: 'Book not found with the provided isbn.',
      },
    },
  })
  update(@Param('isbn') isbn: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(isbn, updateBookDto);
  }

  @Rbac(['admin'], 'delete', 'books')
  @UseGuards(AuthorizationGuard)
  @Delete(':isbn')
  @ApiOperation({
    summary: 'Delete a book by ISBN',
    description:
      'Logical deletes a book using its ISBN. Marks the book as deleted without removing it from the database.',
  })
  @ApiParam({
    name: 'isbn',
    required: true,
    description: 'The ISBN of the book to delete.',
    type: String,
  })
  @ApiOkResponse({
    description: 'Book marked as deleted successfully.',
    schema: {
      example: {
        success: 'true',
        message: 'Book marked as deleted successfully.',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Book not found with the provided ISBN.',
    schema: {
      example: {
        message: 'Book not found with the provided ISBN.',
      },
    },
  })
  remove(@Param('isbn') isbn: string) {
    return this.booksService.remove(isbn);
  }
}
