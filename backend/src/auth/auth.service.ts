import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.userService.create({
      email,
      password: hashedPassword,
      role,
    });

    // Generate JWT token
    return this.generateAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user with password
    const user = await this.userService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    return this.generateAuthResponse(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmailWithPassword(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  private generateAuthResponse(user: User): AuthResponse {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
