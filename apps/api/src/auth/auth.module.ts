import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from '../users/users.module';
import { AUTH_CONFIG, readAuthConfig } from './auth.config';
import { AuthGuard } from './auth.guard';
import { ClerkTokenVerifier } from './clerk-token-verifier';
import { MeController } from './me.controller';
import { RolesGuard } from './roles.guard';
import { TokenVerifier } from './token-verifier';

@Module({
  imports: [UsersModule],
  controllers: [MeController],
  providers: [
    { provide: AUTH_CONFIG, useFactory: () => readAuthConfig(process.env) },
    { provide: TokenVerifier, useClass: ClerkTokenVerifier },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
