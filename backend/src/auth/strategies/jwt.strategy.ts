/**
 * JWT Authentication Strategy
 *
 * Passport strategy for validating JWT tokens from HTTP-only cookies.
 * Integrates with Passport.js to provide authentication middleware.
 *
 * @module JwtStrategy
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import type { Request } from 'express';

/**
 * JWT Payload Interface
 *
 * Defines the structure of data encoded in JWT tokens.
 * Should contain minimal necessary information to reduce token size.
 */
export interface JwtPayload {
  sub: string; // Subject (user ID) - standard JWT claim
  email: string; // User email for identification
  role: string; // User role for authorization checks
}

/**
 * Validated User Interface
 *
 * Defines the structure of the user object attached to requests after JWT validation.
 */
export interface ValidatedUser {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Initialize JWT Strategy
   *
   * Configures Passport JWT strategy to extract and validate tokens from cookies.
   *
   * @param configService - Access to environment variables
   * @param userService - Service for user validation
   *
   * @throws {Error} If JWT_SECRET environment variable is not defined
   */
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    // Validate JWT secret is configured
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    /**
     * Passport Strategy Configuration
     *
     * jwtFromRequest: Custom extractor that reads JWT from HTTP-only cookie
     * ignoreExpiration: Reject expired tokens (default: false)
     * secretOrKey: Secret used to verify token signature
     */
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        /**
         * Cookie Extractor
         *
         * Extracts JWT token from 'access_token' cookie in request.
         * This provides XSS protection as JavaScript cannot access HTTP-only cookies.
         *
         * @param request - Express request object
         * @returns JWT token string or null
         */
        (request: Request): string | null => {
          const cookies = request?.cookies as
            | Record<string, string>
            | undefined;
          return cookies?.access_token ?? null;
        },
      ]),
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: secret,
    });
  }

  /**
   * Validate JWT Payload
   *
   * Called by Passport after successful token verification.
   * Validates that the user still exists in the database.
   *
   * @param payload - Decoded JWT payload
   * @returns User object attached to request (req.user)
   *
   * @throws {UnauthorizedException} If user no longer exists
   *
   * Note: This method runs on every authenticated request.
   * Consider caching user data to reduce database queries.
   */
  async validate(payload: JwtPayload): Promise<ValidatedUser> {
    // Verify user still exists (handles deleted/disabled accounts)
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    /**
     * Return user object to be attached to request
     *
     * This object becomes available in controllers via @CurrentUser() decorator.
     * Contains minimal data from JWT payload, not full database user object.
     */
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
