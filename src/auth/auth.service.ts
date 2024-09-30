import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UsersService } from 'src/user/users.service';

// Mark the AuthService class as injectable, allowing it to be used in other classes
@Injectable()
export class AuthService {
  //inject dependencies through the constructor
  constructor(private readonly usersService: UsersService) {}

  async registerUser(createUserDto: CreateUserDto): Promise<User | void> {
    console.log(this.usersService);
    // Call the create method from the UsersService to create a new user
    return await this.usersService.create(createUserDto);
  }
}
