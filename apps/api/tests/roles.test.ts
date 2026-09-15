import './auth-fixtures';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../src/auth/roles.guard';
import { REQUIRED_ROLES } from '../src/auth/roles.decorator';
import { executionContext, users } from './auth-fixtures';

const guard = new RolesGuard(new Reflector());

test('RBAC enforces internal roles and supervisor inherits agent permissions', () => {
  const handler = function restricted() {};
  Reflect.defineMetadata(REQUIRED_ROLES, ['AGENT'], handler);
  assert.equal(guard.canActivate(executionContext({ user: users[0] }, handler)), true);
  assert.equal(guard.canActivate(executionContext({ user: users[1] }, handler)), true);
  Reflect.defineMetadata(REQUIRED_ROLES, ['SUPERVISOR'], handler);
  assert.throws(() => guard.canActivate(executionContext({ user: users[0], claims: { role: 'SUPERVISOR' } }, handler)), ForbiddenException);
  assert.equal(guard.canActivate(executionContext({ user: users[1] }, handler)), true);
  assert.throws(() => guard.canActivate(executionContext({}, handler)), ForbiddenException);
  assert.throws(() => guard.canActivate(executionContext({ user: users[2] }, handler)), ForbiddenException);
});

test('RBAC respects controller metadata and permits no-role routes after authentication', () => {
  class SupervisorController {}
  Reflect.defineMetadata(REQUIRED_ROLES, ['SUPERVISOR'], SupervisorController);
  assert.throws(() => guard.canActivate(executionContext({ user: users[0] }, undefined, SupervisorController)), ForbiddenException);
  assert.equal(guard.canActivate(executionContext({ user: users[0] })), true);
});
