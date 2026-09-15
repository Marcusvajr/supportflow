import type { Request } from 'express';
import type { User } from '../users/user';

export type AuthRequest = Request & { user?: User };
