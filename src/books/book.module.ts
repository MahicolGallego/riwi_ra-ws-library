import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { PermissionModule } from 'src/permissions/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    AuthModule,
    UserModule,
    PermissionModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BookModule {}
