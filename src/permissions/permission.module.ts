import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AuthorizationGuard } from 'src/permissions/guards/authorization.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [PermissionsService, AuthorizationGuard],
  exports: [PermissionsService, AuthorizationGuard], // Exports components for use in other modules that import this module
})
export class PermissionModule {}
