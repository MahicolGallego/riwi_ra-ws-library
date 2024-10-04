import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PermissionsService } from '../permissions.service';
import { Reflector } from '@nestjs/core';
import { ErrorManager } from 'src/common/filters/error-manage.filter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  // inject dependencies through the constructor
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
    @InjectPinoLogger(AuthorizationGuard.name)
    private readonly logger: PinoLogger,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      this.logger.info('Entering AuthorizationGuard');

      // Get the requesting user from the request context
      const request = context.switchToHttp().getRequest();
      const { user } = request;

      if (!user) {
        this.logger.warn(
          'Unauthorized access attempt detected. No user found in request.',
        );
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Unauthorized access. No user found in request.',
        });
      }

      this.logger.info(
        `User with role ${user.role} attempting access to ${request.path}`,
      );

      // necessaries authorization checks based on the user's role and permissions
      // get rbac object in the metadata
      const rbac = this.reflector.get('rbac', context.getHandler());

      if (!rbac) {
        this.logger.error('RBAC metadata not found on the current route.');
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'RBAC metadata not found.',
        });
      }

      // destructure rbac properties for the permissions
      const { allowed_roles, allowed_action, entity } = rbac;

      this.logger.info(
        `RBAC details - Action: ${allowed_action}, Entity: ${entity}`,
      );

      // check if user's role is allowed to access the requested entity and action
      // check user's role
      if (!allowed_roles.includes(user.role)) {
        this.logger.warn(
          `Access denied. Role ${user.role} does not have sufficient permissions for ${allowed_action} in ${entity} entity`,
        );

        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: `Role ${user.role} does not have sufficient permissions for ${allowed_action} in ${entity} entity`,
        });
      }

      this.logger.info(
        `Checking permissions for role ${user.role} on entity ${entity}`,
      );

      // check user's permissions by role and entity
      const permission = await this.permissionsService.findPermissions(
        user.role,
        entity,
      );

      // check if the requested action is allowed by the user's permissions

      if (!permission[allowed_action]) {
        this.logger.warn(
          `Access denied. Role ${user.role} lacks the necessary permissions for ${allowed_action} in ${entity} entity`,
        );
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: `role ${user.role} doest not have sufficient permissions for ${allowed_action} in ${entity} entity`,
        });
      }

      this.logger.info(
        `Authorization successful for user with role ${user.role} on ${entity}`,
      );

      // if all checks pass, return true to allow the request to proceed
      return true;
    } catch (error) {
      this.logger.error(`Authorization error`, error);
      // If an error occurs, throw a signature error using the custom ErrorManager
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : ErrorManager.createSignatureError('an unexpected error occurred');
    }
  }
}
