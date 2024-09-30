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
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Book } from './entities/book.entity';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { AuthorizationGuard } from 'src/permissions/guards/authorization.guard';
import { Rbca } from 'src/common/decorators/rbac.decorator';
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
  @Rbca(['admin'], 'write', 'books')
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

  @Get()
  @ApiOperation({
    summary: 'Get all books with the filter options provided',
    description:
      'Get all books with the filter options provided in the query params and Applying pagination. By author, genre, titulo, page',
  })
  @ApiQuery({
    name: 'author',
    required: false,
    description: 'author of the book',
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    description: 'genre of the book',
  })
  @ApiQuery({
    name: 'publish_date',
    required: false,
    description: 'publish date of the book',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'page for the books result list',
  })
  async findAllBooks(
    @Query('author') author: string,
    @Query('gender') gender: string,
    @Query('publish_date') publish_date: Date,
    @Query('page') page: number,
  ) {
    const findLeakedBooksDto: FindLeakedBooksDto = {
      author,
      gender,
      publish_date,
    };
    return await this.booksService.findAllLeakedBooks(findLeakedBooksDto, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
