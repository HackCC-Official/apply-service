import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify } from 'jose';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(private configService: ConfigService) {
const urlString = `${this.configService.get<string>('SUPABASE_URL')}/auth/v1/.well-known/jwks.json`;
  
  // Test if the URL is valid before jose touches it
  try {
    const testUrl = new URL(urlString);
    this.jwks = createRemoteJWKSet(testUrl);
  } catch (err) {
    console.error('CRITICAL: Invalid JWKS URL construction:', err);
    throw err;
  }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const token = authHeader.slice(7);

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: `${this.configService.get<string>('SUPABASE_URL')}/auth/v1`,
      });
      request.user = payload;
      console.log(payload)
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}