import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Import the User entity for use with TypeORM
  providers: [UsersService],
  exports: [UsersService], // Export UsersService for use in other modules that import this module
})
export class UserModule {}
