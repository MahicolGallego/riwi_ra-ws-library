import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule], // Include UserModule to allow access to user-related services
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
