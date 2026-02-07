/**
 * Authentication Controller
 *
 * REST API endpoints for user authentication operations including registration,
 * login, logout, and profile retrieval. Implements HTTP-only cookie-based
 * authentication for enhanced security.
 *
 * @module AuthController
 */

import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register New User
   *
   * Creates a new user account and immediately authenticates them.
   * Sets HTTP-only cookie containing JWT token for secure session management.
   *
   * @route POST /auth/register
   * @access Public
   *
   * @param registerDto - User registration data validated by class-validator
   * @param response - Express response object for setting cookies
   * @returns User data without sensitive information
   *
   * @throws {ConflictException} If email already exists
   * @throws {BadRequestException} If validation fails
   *
   * Security Features:
   * - Password is hashed before storage
   * - JWT stored in HTTP-only cookie (immune to XSS)
   * - SameSite=lax prevents CSRF attacks
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(registerDto);

    /**
     * Set Authentication Cookie
     *
     * Cookie Options:
     * - httpOnly: true - Prevents JavaScript access (XSS protection)
     * - secure: true in production - HTTPS only
     * - sameSite: 'lax' - Prevents CSRF attacks
     * - maxAge: 1 hour - Matches JWT expiration
     */
    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // Return only user data, token is in HTTP-only cookie
    return { user: result.user };
  }

  /**
   * User Login
   *
   * Authenticates user credentials and establishes authenticated session.
   * Sets HTTP-only cookie with JWT token.
   *
   * @route POST /auth/login
   * @access Public
   *
   * @param loginDto - Login credentials (email and password)
   * @param response - Express response object for setting cookies
   * @returns User data without sensitive information
   *
   * @throws {UnauthorizedException} If credentials are invalid
   *
   * Security:
   * - Generic error messages prevent email enumeration
   * - Bcrypt password comparison is timing-safe
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // Set authentication cookie with same security options as registration
    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000, // 1 hour
    });

    // Return only user data
    return { user: result.user };
  }

  /**
   * Get User Profile
   *
   * Retrieves complete profile data for authenticated user.
   *
   * @route GET /auth/profile
   * @access Protected - Requires valid JWT
   *
   * @param userId - Extracted from JWT payload by CurrentUser decorator
   * @returns Complete user profile without password
   *
   * @throws {UnauthorizedException} If token is invalid or user not found
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  /**
   * Get Current User
   *
   * Returns the currently authenticated user from JWT payload.
   * Lightweight endpoint for session validation.
   *
   * @route GET /auth/me
   * @access Protected - Requires valid JWT
   *
   * @param user - User object extracted from JWT by JwtStrategy
   * @returns Minimal user data from JWT payload
   *
   * Note: Returns JWT payload data, not full database user object
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@CurrentUser() user: any): any {
    return user;
  }

  /**
   * User Logout
   *
   * Terminates user session by clearing the authentication cookie.
   *
   * @route POST /auth/logout
   * @access Public (but typically called by authenticated users)
   *
   * @param response - Express response object for clearing cookies
   * @returns Success message
   *
   * Note: JWT remains valid until expiration, but cookie removal
   * prevents it from being sent with future requests
   */
  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response): { message: string } {
    response.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}
