import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ApiKeyGuard } from './guards/api-key.guard';

@Module({
  imports: [UserModule], // Include UserModule to allow access to user-related services
  controllers: [AuthController],
  providers: [AuthService, ApiKeyGuard],
  exports: [ApiKeyGuard], // Export ApiKeyGuard for use in other modules that import this module
})
export class AuthModule {}
