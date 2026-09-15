import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../users/user';

export const REQUIRED_ROLES = Symbol('REQUIRED_ROLES');
export const Roles = (...roles: UserRole[]) => SetMetadata(REQUIRED_ROLES, roles);
