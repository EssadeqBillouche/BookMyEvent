/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { RegistrationService } from './registration.service';
import {
  Registration,
  RegistrationStatus,
} from './entities/registration.entity';
import { Event, EventStatus } from '../event/entities/event.entity';
import { User, UserRole } from '../user/entities/user.entity';

describe('RegistrationService', () => {
  let service: RegistrationService;
  let registrationRepository: Repository<Registration>;
  let eventRepository: Repository<Event>;

  const mockUser: User = {
    id: 'user-uuid-123',
    email: 'user@example.com',
    password: 'hashedPassword',
    role: UserRole.PARTICIPANT,
    firstName: 'John',
    lastName: 'Doe',
    profilePicture: 'https://example.com/photo.jpg',
  };

  const mockOtherUser: User = {
    id: 'user-uuid-456',
    email: 'other@example.com',
    password: 'hashedPassword',
    role: UserRole.PARTICIPANT,
    firstName: 'Jane',
    lastName: 'Doe',
    profilePicture: 'https://example.com/photo2.jpg',
  };

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);
  const futureEndDate = new Date();
  futureEndDate.setDate(futureEndDate.getDate() + 8);
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 7);

  const mockEvent: Event = {
    id: 'event-uuid-123',
    title: 'Test Event',
    description: 'A test event description',
    startDate: futureDate,
    endDate: futureEndDate,
    location: 'Test Location',
    capacity: 100,
    registeredCount: 10,
    status: EventStatus.PUBLISHED,
    imageUrl: 'https://example.com/image.jpg',
    price: 50,
    isFeatured: false,
    createdById: 'admin-uuid',
    createdBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRegistration: Registration = {
    id: 'registration-uuid-123',
    userId: mockUser.id,
    eventId: mockEvent.id,
    user: mockUser,
    event: mockEvent,
    status: RegistrationStatus.CONFIRMED,
    notes: 'Test notes',
    registeredAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRegistrationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockEventRepository = {
    findOne: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationService,
        {
          provide: getRepositoryToken(Registration),
          useValue: mockRegistrationRepository,
        },
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<RegistrationService>(RegistrationService);
    registrationRepository = module.get<Repository<Registration>>(
      getRepositoryToken(Registration),
    );
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createRegistrationDto = {
      eventId: mockEvent.id,
      notes: 'Looking forward to this event',
    };

    it('should create a new registration', async () => {
      mockEventRepository.findOne.mockResolvedValue(mockEvent);
      mockRegistrationRepository.findOne
        .mockResolvedValueOnce(null) // No existing registration
        .mockResolvedValueOnce(mockRegistration); // Return after save
      mockRegistrationRepository.create.mockReturnValue(mockRegistration);
      mockRegistrationRepository.save.mockResolvedValue(mockRegistration);
      mockEventRepository.increment.mockResolvedValue({ affected: 1 });

      const result = await service.create(createRegistrationDto, mockUser);

      expect(mockEventRepository.findOne).toHaveBeenCalledWith({
        where: { id: createRegistrationDto.eventId },
      });
      expect(mockRegistrationRepository.create).toHaveBeenCalledWith({
        userId: mockUser.id,
        eventId: createRegistrationDto.eventId,
        notes: createRegistrationDto.notes,
        status: RegistrationStatus.CONFIRMED,
      });
      expect(mockEventRepository.increment).toHaveBeenCalledWith(
        { id: createRegistrationDto.eventId },
        'registeredCount',
        1,
      );
      expect(result).toEqual(mockRegistration);
    });

    it('should throw NotFoundException if event not found', async () => {
      mockEventRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create(createRegistrationDto, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if event is not published', async () => {
      const unpublishedEvent = { ...mockEvent, status: EventStatus.DRAFT };
      mockEventRepository.findOne.mockResolvedValue(unpublishedEvent);

      await expect(
        service.create(createRegistrationDto, mockUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if event is at full capacity', async () => {
      const fullEvent = { ...mockEvent, registeredCount: 100 };
      mockEventRepository.findOne.mockResolvedValue(fullEvent);

      await expect(
        service.create(createRegistrationDto, mockUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if event date has passed', async () => {
      const pastEvent = { ...mockEvent, startDate: pastDate };
      mockEventRepository.findOne.mockResolvedValue(pastEvent);

      await expect(
        service.create(createRegistrationDto, mockUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if user is already registered', async () => {
      mockEventRepository.findOne.mockResolvedValue(mockEvent);
      mockRegistrationRepository.findOne.mockResolvedValue(mockRegistration);

      await expect(
        service.create(createRegistrationDto, mockUser),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all registrations', async () => {
      mockRegistrationRepository.find.mockResolvedValue([mockRegistration]);

      const result = await service.findAll();

      expect(mockRegistrationRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'event'],
        order: { registeredAt: 'DESC' },
      });
      expect(result).toEqual([mockRegistration]);
    });
  });

  describe('findByEvent', () => {
    it('should return registrations for a specific event', async () => {
      mockRegistrationRepository.find.mockResolvedValue([mockRegistration]);

      const result = await service.findByEvent(mockEvent.id);

      expect(mockRegistrationRepository.find).toHaveBeenCalledWith({
        where: { eventId: mockEvent.id },
        relations: ['user', 'event'],
        order: { registeredAt: 'DESC' },
      });
      expect(result).toEqual([mockRegistration]);
    });
  });

  describe('findByUser', () => {
    it('should return registrations for a specific user', async () => {
      mockRegistrationRepository.find.mockResolvedValue([mockRegistration]);

      const result = await service.findByUser(mockUser.id);

      expect(mockRegistrationRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        relations: ['user', 'event'],
        order: { registeredAt: 'DESC' },
      });
      expect(result).toEqual([mockRegistration]);
    });
  });

  describe('findOne', () => {
    it('should return a registration by id', async () => {
      mockRegistrationRepository.findOne.mockResolvedValue(mockRegistration);

      const result = await service.findOne(mockRegistration.id);

      expect(mockRegistrationRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockRegistration.id },
        relations: ['user', 'event'],
      });
      expect(result).toEqual(mockRegistration);
    });

    it('should throw NotFoundException if registration not found', async () => {
      mockRegistrationRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('isUserRegistered', () => {
    it('should return true if user is registered for the event', async () => {
      mockRegistrationRepository.findOne.mockResolvedValue(mockRegistration);

      const result = await service.isUserRegistered(mockUser.id, mockEvent.id);

      expect(mockRegistrationRepository.findOne).toHaveBeenCalledWith({
        where: {
          userId: mockUser.id,
          eventId: mockEvent.id,
          status: RegistrationStatus.CONFIRMED,
        },
      });
      expect(result).toBe(true);
    });

    it('should return false if user is not registered', async () => {
      mockRegistrationRepository.findOne.mockResolvedValue(null);

      const result = await service.isUserRegistered(mockUser.id, mockEvent.id);

      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    const updateDto = {
      status: RegistrationStatus.ATTENDED,
      notes: 'Updated notes',
    };

    it('should update a registration', async () => {
      mockRegistrationRepository.findOne.mockResolvedValue(mockRegistration);
      const updatedRegistration = { ...mockRegistration, ...updateDto };
      mockRegistrationRepository.save.mockResolvedValue(updatedRegistration);

      const result = await service.update(mockRegistration.id, updateDto);

      expect(mockRegistrationRepository.save).toHaveBeenCalled();
      expect(result.status).toBe(RegistrationStatus.ATTENDED);
    });
  });

  describe('cancel', () => {
    it('should cancel a registration by the owner', async () => {
      mockRegistrationRepository.findOne.mockResolvedValue(mockRegistration);
      const cancelledRegistration = {
        ...mockRegistration,
        status: RegistrationStatus.CANCELLED,
      };
      mockRegistrationRepository.save.mockResolvedValue(cancelledRegistration);
      mockEventRepository.decrement.mockResolvedValue({ affected: 1 });

      const result = await service.cancel(mockRegistration.id, mockUser);

      expect(mockRegistrationRepository.save).toHaveBeenCalled();
      expect(mockEventRepository.decrement).toHaveBeenCalledWith(
        { id: mockRegistration.eventId },
        'registeredCount',
        1,
      );
      expect(result.status).toBe(RegistrationStatus.CANCELLED);
    });

    it('should throw BadRequestException if user does not own the registration', async () => {
      mockRegistrationRepository.findOne.mockResolvedValue(mockRegistration);

      await expect(
        service.cancel(mockRegistration.id, mockOtherUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if registration is already cancelled', async () => {
      const cancelledRegistration = {
        ...mockRegistration,
        status: RegistrationStatus.CANCELLED,
      };
      mockRegistrationRepository.findOne.mockResolvedValue(
        cancelledRegistration,
      );

      await expect(
        service.cancel(mockRegistration.id, mockUser),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a confirmed registration and decrement count', async () => {
      const confirmedRegistration = {
        ...mockRegistration,
        status: RegistrationStatus.CONFIRMED,
      };
      // findOne is called internally which uses findOne with relations
      mockRegistrationRepository.findOne.mockResolvedValue(
        confirmedRegistration,
      );
      mockRegistrationRepository.delete.mockResolvedValue({ affected: 1 });
      mockEventRepository.decrement.mockResolvedValue({ affected: 1 });

      await service.remove(confirmedRegistration.id);

      expect(mockEventRepository.decrement).toHaveBeenCalledWith(
        { id: confirmedRegistration.eventId },
        'registeredCount',
        1,
      );
      expect(mockRegistrationRepository.delete).toHaveBeenCalledWith(
        confirmedRegistration.id,
      );
    });

    it('should delete a cancelled registration without decrementing count', async () => {
      const cancelledRegistration = {
        ...mockRegistration,
        status: RegistrationStatus.CANCELLED,
      };
      mockRegistrationRepository.findOne.mockResolvedValue(
        cancelledRegistration,
      );
      mockRegistrationRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(cancelledRegistration.id);

      expect(mockEventRepository.decrement).not.toHaveBeenCalled();
      expect(mockRegistrationRepository.delete).toHaveBeenCalledWith(
        cancelledRegistration.id,
      );
    });
  });

  describe('getEventStats', () => {
    it('should return event statistics', async () => {
      const registrations = [
        { ...mockRegistration, status: RegistrationStatus.CONFIRMED },
        { ...mockRegistration, id: '2', status: RegistrationStatus.CONFIRMED },
        { ...mockRegistration, id: '3', status: RegistrationStatus.CANCELLED },
        { ...mockRegistration, id: '4', status: RegistrationStatus.ATTENDED },
      ];
      mockRegistrationRepository.find.mockResolvedValue(registrations);

      const result = await service.getEventStats(mockEvent.id);

      expect(mockRegistrationRepository.find).toHaveBeenCalledWith({
        where: { eventId: mockEvent.id },
      });
      expect(result).toEqual({
        total: 4,
        confirmed: 2,
        cancelled: 1,
        attended: 1,
      });
    });

    it('should return zero counts for event with no registrations', async () => {
      mockRegistrationRepository.find.mockResolvedValue([]);

      const result = await service.getEventStats(mockEvent.id);

      expect(result).toEqual({
        total: 0,
        confirmed: 0,
        cancelled: 0,
        attended: 0,
      });
    });
  });
});
