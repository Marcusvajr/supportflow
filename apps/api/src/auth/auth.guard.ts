import { Inject, Injectable, UnauthorizedException, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import type { AuthRequest } from './auth-request';
import { IS_PUBLIC } from './public.decorator';
import { TokenVerifier } from './token-verifier';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(TokenVerifier) private readonly verifier: TokenVerifier,
    @Inject(UsersService) private readonly users: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [context.getHandler(), context.getClass()])) return true;
    const request = context.switchToHttp().getRequest<AuthRequest>();
    delete request.user;
    const header = request.headers.authorization;
    const match = typeof header === 'string' ? /^Bearer ([^\s,]+)$/i.exec(header) : null;
    if (!match) throw new UnauthorizedException('Informe um token de sessão válido.');
    const { externalAuthId } = await this.verifier.verify(match[1]);
    request.user = await this.users.resolveActiveUser(externalAuthId);
    return true;
  }
}
