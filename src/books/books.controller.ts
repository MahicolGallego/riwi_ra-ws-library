import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
  ApiTags,
} from '@nestjs/swagger';
import { Book } from './entities/book.entity';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { AuthorizationGuard } from 'src/permissions/guards/authorization.guard';
import { Rbca } from 'src/common/decorators/rbac.decorator';

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
  findAll() {
    return this.booksService.findAll();
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
