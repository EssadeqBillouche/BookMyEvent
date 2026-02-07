/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/entities/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: UserRole.PARTICIPANT,
    firstName: 'John',
    lastName: 'Doe',
    profilePicture: 'https://example.com/photo.jpg',
  };

  const mockUserService = {
    findByEmail: jest.fn(),
    findByEmailWithPassword: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'newuser@example.com',
      password: 'password123',
      role: UserRole.PARTICIPANT,
      firstName: 'John',
      lastName: 'Doe',
      profilePicture: 'https://example.com/photo.jpg',
    };

    it('should successfully register a new user', async () => {
      const createdUser = { ...mockUser, email: registerDto.email };
      
      mockUserService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUserService.create.mockResolvedValue(createdUser);

      const result = await authService.register(registerDto);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockUserService.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: 'hashedPassword',
        role: registerDto.role,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        profilePicture: registerDto.profilePicture,
      });
      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: {
          id: createdUser.id,
          email: createdUser.email,
          role: createdUser.role,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          profilePicture: createdUser.profilePicture,
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(mockUserService.create).not.toHaveBeenCalled();
    });

    it('should register user with default role if not provided', async () => {
      const registerDtoWithoutRole = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://example.com/photo.jpg',
      };
      const createdUser = { ...mockUser, email: registerDtoWithoutRole.email };

      mockUserService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUserService.create.mockResolvedValue(createdUser);

      await authService.register(registerDtoWithoutRole);

      expect(mockUserService.create).toHaveBeenCalledWith({
        email: registerDtoWithoutRole.email,
        password: 'hashedPassword',
        role: undefined,
        firstName: registerDtoWithoutRole.firstName,
        lastName: registerDtoWithoutRole.lastName,
        profilePicture: registerDtoWithoutRole.profilePicture,
      });
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login a user with valid credentials', async () => {
      mockUserService.findByEmailWithPassword.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(loginDto);

      expect(mockUserService.findByEmailWithPassword).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          profilePicture: mockUser.profilePicture,
        },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUserService.findByEmailWithPassword.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      mockUserService.findByEmailWithPassword.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserService.findByEmailWithPassword.mockResolvedValue(null);

      const result = await authService.validateUser(
        'nonexistent@example.com',
        'password123',
      );

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      mockUserService.findByEmailWithPassword.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userWithoutPassword = {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      };
      mockUserService.findById.mockResolvedValue(userWithoutPassword);

      const result = await authService.getProfile(mockUser.id);

      expect(mockUserService.findById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(userWithoutPassword);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserService.findById.mockResolvedValue(null);

      await expect(authService.getProfile('invalid-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
