import { verifyToken } from '@clerk/backend';
import { Inject, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { AUTH_CONFIG, type AuthConfig } from './auth.config';
import { TokenVerifier } from './token-verifier';

@Injectable()
export class ClerkTokenVerifier extends TokenVerifier {
  constructor(@Inject(AUTH_CONFIG) private readonly config: AuthConfig) { super(); }

  async verify(token: string): Promise<{ externalAuthId: string }> {
    const { secretKey, jwtKey, issuer, authorizedParties } = this.config;
    if ((!secretKey && !jwtKey) || !issuer || !authorizedParties.length) {
      throw new ServiceUnavailableException('Autenticação temporariamente indisponível.');
    }

    try {
      const payload = await verifyToken(token, { secretKey, jwtKey, authorizedParties });
      // Aceitar somente sessões de usuário da instância e origem esperadas.
      if (payload.iss !== issuer || !payload.sub || !payload.sid
        || !payload.azp || !authorizedParties.includes(payload.azp)
        || (payload.sts !== undefined && payload.sts !== 'active')) {
        throw new Error('Invalid session');
      }
      return { externalAuthId: payload.sub };
    } catch {
      // Nunca propagar o erro bruto do SDK (ele pode incluir claims ou o token).
      throw new UnauthorizedException('Sessão inválida ou expirada.');
    }
  }
}
