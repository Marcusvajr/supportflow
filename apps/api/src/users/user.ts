export type UserRole = 'AGENT' | 'SUPERVISOR';

export type User = Readonly<{
  id: string;
  externalAuthId: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}>;

export function isUserRole(value: unknown): value is UserRole {
  return value === 'AGENT' || value === 'SUPERVISOR';
}
