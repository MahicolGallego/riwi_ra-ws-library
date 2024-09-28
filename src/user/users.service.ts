import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { ErrorManager } from 'src/common/filters/error-manage.filter';

// Mark the UsersService class as injectable, allowing it to be used in other classes
@Injectable()
export class UsersService {
  //inject dependencies through the constructor
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // Method to create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Generate a unique API key for the new user
      const apiKey = await this.generateUniqueApiKey();
      createUserDto.api_key = apiKey; // Assign the generated API key to the DTO
      const newUser = this.userRepository.create(createUserDto); // Create a new user instance
      return await this.userRepository.save(newUser); // Save the new user to the database
    } catch (error) {
      // If an error occurs, throw a signature error using the custom ErrorManager
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('an unexpected error occurred');
    }
  }

  async findByApiKey(apiKey: string): Promise<User | void> {
    // Query the user repository for a user with the given API key
    return await this.userRepository.findOne({ where: { api_key: apiKey } });
  }

  // Method to generate a unique API key
  async generateUniqueApiKey(): Promise<string> {
    let apiKey: string;
    let userNotExist = false;
    while (!userNotExist) {
      // Generate a random API key
      apiKey = randomBytes(20).toString('hex');
      // Check if the generated API key already exists
      const user = await this.findByApiKey(apiKey);
      userNotExist = !user; // Set the flag if the user does not exist
    }
    return apiKey; // Return the unique API key
  }
}
