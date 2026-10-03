import { verifyToken } from '@clerk/backend';
import { Inject, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { AUTH_CONFIG, type AuthConfig } from './auth.config';
import { TokenVerifier } from './token-verifier';

@Injectable()
export class ClerkTokenVerifier extends TokenVerifier {
  constructor(@Inject(AUTH_CONFIG) private readonly config: AuthConfig) { super(); }

  async verify(token: string): Promise<{ externalAuthId: string }> {
    const { secretKey, jwtKey, authorizedParties } = this.config;
    if ((!secretKey && !jwtKey) || !authorizedParties.length) {
      throw new ServiceUnavailableException('Autenticação temporariamente indisponível.');
    }

    try {
      const payload = await verifyToken(token, { secretKey, jwtKey, authorizedParties });
      // verifyToken já valida assinatura, expiração e authorizedParties.
      // A aplicação exige apenas uma sessão de usuário ativa.
      if (!payload.sub || !payload.sid || payload.sts === 'pending') {
        throw new Error('Invalid session');
      }
      return { externalAuthId: payload.sub };
    } catch {
      // Nunca propagar o erro bruto do SDK (ele pode incluir claims ou o token).
      throw new UnauthorizedException('Sessão inválida ou expirada.');
    }
  }
}
