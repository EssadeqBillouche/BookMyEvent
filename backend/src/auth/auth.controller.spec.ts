/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRole } from '../user/entities/user.entity';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    role: UserRole.PARTICIPANT,
    firstName: 'John',
    lastName: 'Doe',
    profilePicture: 'https://example.com/photo.jpg',
  };

  const mockAuthResponse = {
    access_token: 'mock-jwt-token',
    user: mockUser,
  };

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    getProfile: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    it('should register a new user successfully', async () => {
      mockAuthService.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.register(registerDto, mockResponse);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        mockAuthResponse.access_token,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
        }),
      );
      expect(result).toEqual({ user: mockUser });
    });

    it('should register user without role (using default)', async () => {
      const registerDtoWithoutRole = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://example.com/photo.jpg',
      };
      mockAuthService.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.register(
        registerDtoWithoutRole,
        mockResponse,
      );

      expect(authService.register).toHaveBeenCalledWith(registerDtoWithoutRole);
      expect(result).toEqual({ user: mockUser });
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        mockAuthResponse.access_token,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
        }),
      );
      expect(result).toEqual({ user: mockUser });
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      mockAuthService.getProfile.mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockUser.id);

      expect(authService.getProfile).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user from request', async () => {
      const result = await controller.getCurrentUser(mockUser);

      expect(result).toEqual(mockUser);
    });
  });
});
