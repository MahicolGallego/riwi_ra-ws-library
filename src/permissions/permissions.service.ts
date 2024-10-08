import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { Roles } from 'src/common/constants/roles.enum';
import { ErrorManager } from 'src/common/filters/error-manage.filter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class PermissionsService {
  constructor(
    //inject dependencies through the constructor
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
    @InjectPinoLogger(PermissionsService.name)
    private readonly logger: PinoLogger,
  ) {}

  async findPermissions(userRole: Roles, entity: string): Promise<Permission> {
    this.logger.info(
      `Searching permissions for role: ${userRole} and entity: ${entity}`,
    );
    try {
      // Find the permission for the given user role and entity in the database. If not found, throw an error.
      const permission = await this.permissionsRepository.findOne({
        where: { role: userRole, entity },
      });

      if (!permission) {
        this.logger.warn(
          `Permissions not found for role ${userRole} and entity ${entity}`,
        );
        throw new ErrorManager({
          type: 'CONFLICT',
          message: `permissions for role ${userRole} and entity ${entity} not found`,
        });
      }

      this.logger.info(
        `Permission found for role ${userRole} and entity ${entity}: ${JSON.stringify(permission)}`,
      );
      return permission;
    } catch (error) {
      this.logger.error(
        `Error finding permissions for role ${userRole} and entity ${entity}`,
        error,
      );
      // If an error occurs, throw a signature error using the custom ErrorManager
      if (error instanceof Error) {
        throw ErrorManager.createSignatureError(error.message);
      }
      throw ErrorManager.createSignatureError('an unexpected error occurred');
    }
  }
}
