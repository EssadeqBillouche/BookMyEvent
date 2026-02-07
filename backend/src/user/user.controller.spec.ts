/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserRole } from './entities/user.entity';
import { Reflector } from '@nestjs/core';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUser: User = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: UserRole.PARTICIPANT,
    firstName: 'essadeq',
    lastName: 'billouche',
    profilePicture: 'sdkjfkldsjfkljds/ccc',
  };

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        Reflector,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto = {
      email: 'newuser@example.com',
      password: 'password123',
      role: UserRole.PARTICIPANT,
      firstName: 'essadeq',
      lastName: 'billouche',
      profilePicture: 'sdkjfkldsjfkljds/ccc',
    };

    it('should create a new user', async () => {
      mockUserService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockUserService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(userService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await controller.findOne(mockUser.id);

      expect(userService.findById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserService.findById.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateUserDto = {
      email: 'updated@example.com',
    };

    it('should update a user', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(mockUser.id, updateUserDto);

      expect(userService.update).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDto,
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserService.remove.mockResolvedValue(undefined);

      await controller.remove(mockUser.id);

      expect(userService.remove).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
