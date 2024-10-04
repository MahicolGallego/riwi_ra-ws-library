import { SetMetadata } from '@nestjs/common';
import { ResourcesActions } from '../constants/resources-actions.enum';
import { Roles } from '../constants/roles.enum';

type rolesKeys = keyof typeof Roles;
type resourcesActionsKeys = keyof typeof ResourcesActions;

export const Rbac = (
  roles: rolesKeys[],
  action: resourcesActionsKeys,
  entity: string,
) =>
  SetMetadata('rbac', { allowed_roles: roles, allowed_action: action, entity });
