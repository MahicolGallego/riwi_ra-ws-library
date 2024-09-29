import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

// Tag the controller for Swagger documentation under 'Auth'
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  //inject dependencies through the constructor
  constructor(private readonly authService: AuthService) {}

  // Define a POST endpoint for user registration
  @Post('register')
  // Endpoint documentation with swagger
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Register a new user, username and email required',
  })
  @ApiBody({
    type: [CreateUserDto],
  })
  @ApiOkResponse({
    description: 'ok',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request, validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: ['username must be a string', 'email must be a valid email'],
        error: 'Bad Request',
      },
    },
  })
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User | void> {
    return await this.authService.registerUser(createUserDto);
  }
}
