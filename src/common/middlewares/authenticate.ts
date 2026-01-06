import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksClient from 'jwks-rsa';
import config from 'config';
import { Request } from 'express';
import { AuthCookie } from '../../types/index';

const jwksUri: string = config.get('auth.jwksUri');

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- jwks-rsa expressJwtSecret returns any
const secretResult: unknown = jwksClient.expressJwtSecret({
  jwksUri,
  cache: true,
  rateLimit: true,
});
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- jwks-rsa expressJwtSecret returns any
const getSecret: GetVerificationKey = secretResult as GetVerificationKey;

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment -- express-jwt types are incomplete
const authenticateMiddleware = expressjwt({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- GetVerificationKey type compatibility
  secret: getSecret,
  algorithms: ['RS256'],
  getToken(req: Request) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.split(' ')[1] !== undefined) {
      const token = authHeader.split(' ')[1];
      if (token) {
        return token;
      }
    }

    const { accessToken } = req.cookies as AuthCookie;
    return accessToken;
  },
});

export default authenticateMiddleware;
