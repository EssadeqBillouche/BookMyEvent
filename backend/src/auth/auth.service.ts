/**
 * Authentication Service
 * 
 * Core business logic for user authentication including registration, login,
 * and profile management. Handles password hashing, JWT token generation,
 * and user validation.
 * 
 * @module AuthService
 */

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';

/**
 * Authentication Response Interface
 * 
 * Defines the structure of successful authentication responses.
 * Contains JWT token and sanitized user data (password excluded).
 */
export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
}

@Injectable()
export class AuthService {
  /**
   * @param userService - Service for user database operations
   * @param jwtService - Service for JWT token generation and validation
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register New User
   * 
   * Creates a new user account with hashed password and generates
   * authentication token for immediate login.
   * 
   * @param registerDto - User registration data (email, password, name, etc.)
   * @returns Authentication response with token and user data
   * 
   * @throws {ConflictException} If email is already registered
   * 
   * Security:
   * - Passwords are hashed using bcrypt with 10 salt rounds
   * - Email uniqueness is enforced at database level
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, firstName, lastName, password, role, profilePicture } = registerDto;

    // Verify email availability to prevent duplicate accounts
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password using bcrypt (10 rounds provides good security/performance balance)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Persist user to database with hashed password
    const user = await this.userService.create({
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      profilePicture,
    });

    // Generate JWT token and return auth response
    return this.generateAuthResponse(user);
  }

  /**
   * Authenticate User (Login)
   * 
   * Validates user credentials and generates JWT token for authenticated session.
   * 
   * @param loginDto - Login credentials (email and password)
   * @returns Authentication response with token and user data
   * 
   * @throws {UnauthorizedException} If credentials are invalid
   * 
   * Security:
   * - Generic error message prevents email enumeration attacks
   * - Password comparison uses bcrypt timing-safe comparison
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Retrieve user including password hash (normally excluded from queries)
    const user = await this.userService.findByEmailWithPassword(email);
    if (!user) {
      // Generic message to prevent email enumeration
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password using bcrypt (timing-safe comparison)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token and return auth response
    return this.generateAuthResponse(user);
  }

  /**
   * Validate User Credentials
   * 
   * Internal method used by Passport strategies to validate user credentials.
   * 
   * @param email - User email address
   * @param password - Plain text password
   * @returns User object if valid, null otherwise
   * 
   * @internal Used by passport-local strategy
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmailWithPassword(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  /**
   * Generate Authentication Response
   * 
   * Private helper method to create JWT token and format authentication response.
   * 
   * @param user - Authenticated user entity
   * @returns Formatted auth response with token and user data
   * 
   * JWT Payload contains:
   * - sub: User ID (subject)
   * - email: User email
   * - role: User role for authorization
   * 
   * @private
   */
  private generateAuthResponse(user: User): AuthResponse {
    // Construct JWT payload with minimal necessary claims
    const payload = {
      sub: user.id,      // Standard JWT claim for user identifier
      email: user.email,
      role: user.role,   // Used for role-based access control
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        // Sanitized user data (password excluded)
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
      },
    };
  }

  /**
   * Get User Profile
   * 
   * Retrieves complete user profile data excluding sensitive information.
   * 
   * @param userId - Unique user identifier
   * @returns User profile without password
   * 
   * @throws {UnauthorizedException} If user not found
   */
  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    // Destructure to exclude password from response
    const { password, ...rest } = user;
    return rest;
  }
}
