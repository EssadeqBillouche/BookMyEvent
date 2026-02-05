import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../../user/user.service';
import { UserRole } from '../../user/entities/user.entity';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userService: UserService;

  const mockUser = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    role: UserRole.PARTICIPANT,
  };

  const mockUserService = {
    findById: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-jwt-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    const payload = {
      sub: 'user-uuid-123',
      email: 'test@example.com',
      role: UserRole.PARTICIPANT,
    };

    it('should return user data when user exists', async () => {
      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(userService.findById).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserService.findById.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
