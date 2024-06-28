import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * Guard to authenticate incoming requests using JWT tokens.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Authenticates the request by verifying the JWT token.
   * @param context - The execution context of the route handler.
   * @returns True if the request is authenticated, otherwise false.
   * @throws UnauthorizedException if the token is missing or invalid.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: `${process.env.JWT_SECRETKEY || 'THIS IS SECRET KEY'}`,
      });
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  /**
   * Extracts the JWT token from the request header.
   * @param request - The HTTP request.
   * @returns The JWT token if found in the Authorization header, otherwise undefined.
   */
  private extractTokenFromHeader(request: Request | any): string | undefined {
    const [type, token] = request.headers
      ? request?.headers.authorization?.split(' ') ?? []
      : request?.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
