import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { ErrorManager } from 'src/common/filters/error-manage.filter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

// Mark the UsersService class as injectable, allowing it to be used in other classes
@Injectable()
export class UsersService {
  //inject dependencies through the constructor
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectPinoLogger(UsersService.name) private readonly logger: PinoLogger,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Log the beginning of the create user process
      this.logger.info('Creating a new user', createUserDto);

      // Generate a unique API key for the new user
      const apiKey = await this.generateUniqueApiKey();
      this.logger.info('Generated API key for user', { apiKey });

      // Create a new user instance
      const newUser = this.userRepository.create({
        ...createUserDto,
        api_key: apiKey,
      });

      // Save the new user to the database
      const savedUser = await this.userRepository.save(newUser);
      this.logger.info('User created successfully', { userId: savedUser.id });

      return savedUser;
    } catch (error) {
      this.logger.error('Error while creating a user', error);
      // If an error occurs, throw a signature error using the custom ErrorManager
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('an unexpected error occurred');
    }
  }

  async findByApiKey(apiKey: string): Promise<User | void> {
    this.logger.info('Searching for user by API key', { apiKey });

    // Query the user repository for a user with the given API key
    return await this.userRepository.findOne({ where: { api_key: apiKey } });
  }

  // Method to generate a unique API key
  async generateUniqueApiKey(): Promise<string> {
    let apiKey: string;
    let userNotExist = false;

    this.logger.info('Starting API key generation process');

    while (!userNotExist) {
      // Generate a random API key
      apiKey = randomBytes(20).toString('hex');

      this.logger.info('Generated potential API key', { apiKey });

      // Check if the generated API key already exists
      const user = await this.findByApiKey(apiKey);
      userNotExist = !user; // Set the flag if the user with the api key does not exist

      if (!userNotExist) {
        this.logger.warn('Generated API key already exists, retrying', {
          apiKey,
        });
      }
    }

    this.logger.info('Unique API key generated successfully', { apiKey });
    return apiKey; // Return the unique API key
  }
}
