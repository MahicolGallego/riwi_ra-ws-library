import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PermissionsService } from '../permissions.service';
import { Reflector } from '@nestjs/core';
import { ErrorManager } from 'src/common/filters/error-manage.filter';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  // inject dependencies through the constructor
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Get the requesting user from the request context
      const request = context.switchToHttp().getRequest();
      const { user } = request;

      console.log(user);

      if (!user) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Unauthorized access. No user found in request.',
        });
      }
      // necessaries authorization checks based on the user's role and permissions

      // get rbac object in the metadata
      const rbac = this.reflector.get('rbac', context.getHandler());

      if (!rbac) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'RBAC metadata not found.',
        });
      }

      // destructure rbac properties for the permissions
      const { allowed_roles, allowed_action, entity } = rbac;

      // check if user's role is allowed to access the requested entity and action
      // check user's role
      if (!allowed_roles.includes(user.role)) {
        if (!user) {
          throw new ErrorManager({
            type: 'FORBIDDEN',
            message: `Role ${user.role} does not have sufficient permissions for ${allowed_action} in ${entity} entity`,
          });
        }
      }

      // check user's permissions by role and entity
      const permission = await this.permissionsService.findPermissions(
        user.role,
        entity,
      );

      // check if the requested action is allowed by the user's permissions

      if (!permission[allowed_action]) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: `role ${user.role} doest not have suficients permissions for ${allowed_action} in ${entity} entity`,
        });
      }

      // if all checks pass, return true to allow the request to proceed
      return true;
    } catch (error) {
      // If an error occurs, throw a signature error using the custom ErrorManager
      throw error instanceof Error
        ? ErrorManager.createSignatureError(error.message)
        : ErrorManager.createSignatureError('an unexpected error occurred');
    }
  }
}
