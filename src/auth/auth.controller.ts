import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// Tag the controller for Swagger documentation under 'Auth'
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  //inject dependencies through the constructor
  constructor(private readonly authService: AuthService) {}

  // Define a POST endpoint for user registration
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async registerUser(
    @Body() createUserDto: CreateUserDto, // Accept the CreateUserDto in the request body
  ): Promise<User | void> {
    // Call the registerUser method in AuthService to handle user registration
    return await this.authService.registerUser(createUserDto);
  }
}
