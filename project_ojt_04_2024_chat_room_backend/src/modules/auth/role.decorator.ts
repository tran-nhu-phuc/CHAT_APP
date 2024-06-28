import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../users/enums/user.enum';
/**
 * Decorator used to assign roles to a endpoint or controller.
 *
 * @param role - User roles allowed to access the decorated endpoint or controller.
 */

export const ROLES_KEY = 'role';
export const Roles = (...role: UserRoles[]) => SetMetadata(ROLES_KEY, role);
