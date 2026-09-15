export abstract class TokenVerifier {
  abstract verify(token: string): Promise<{ externalAuthId: string }>;
}
