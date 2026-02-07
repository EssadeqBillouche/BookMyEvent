/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { EventService } from './event.service';
import { Event, EventStatus } from './entities/event.entity';
import { User, UserRole } from '../user/entities/user.entity';

describe('EventService', () => {
  let service: EventService;
  let repository: Repository<Event>;

  const mockUser: User = {
    id: 'user-uuid-123',
    email: 'admin@example.com',
    password: 'hashedPassword',
    role: UserRole.ADMIN,
    firstName: 'Admin',
    lastName: 'User',
    profilePicture: 'https://example.com/photo.jpg',
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
    registeredCount: 0,
    status: EventStatus.DRAFT,
    imageUrl: 'https://example.com/image.jpg',
    price: 50,
    isFeatured: false,
    createdById: mockUser.id,
    createdBy: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createEventDto = {
      title: 'New Event',
      description: 'Event description',
      startDate: futureDate.toISOString(),
      endDate: futureEndDate.toISOString(),
      location: 'Event Location',
      capacity: 100,
      price: 25,
      isFeatured: false,
    };

    it('should create a new event', async () => {
      mockRepository.create.mockReturnValue(mockEvent);
      mockRepository.save.mockResolvedValue(mockEvent);

      const result = await service.create(createEventDto, mockUser);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createEventDto,
        startDate: new Date(createEventDto.startDate),
        endDate: new Date(createEventDto.endDate),
        createdById: mockUser.id,
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockEvent);
    });

    it('should throw BadRequestException if start date is in the past', async () => {
      const invalidDto = {
        ...createEventDto,
        startDate: pastDate.toISOString(),
      };

      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if end date is before start date', async () => {
      const invalidDto = {
        ...createEventDto,
        endDate: pastDate.toISOString(),
      };

      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return published events for public view', async () => {
      const publishedEvent = { ...mockEvent, status: EventStatus.PUBLISHED };
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([publishedEvent]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findAll();

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'event.status = :publishedStatus',
        { publishedStatus: EventStatus.PUBLISHED },
      );
      expect(result).toEqual([publishedEvent]);
    });

    it('should return all events when includePrivate is true', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockEvent]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findAll({ includePrivate: true });

      expect(result).toEqual([mockEvent]);
    });

    it('should filter by status when provided', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockEvent]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await service.findAll({
        status: EventStatus.DRAFT,
        includePrivate: true,
      });

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'event.status = :status',
        { status: EventStatus.DRAFT },
      );
    });
  });

  describe('findAllForAdmin', () => {
    it('should return all events with relations', async () => {
      mockRepository.find.mockResolvedValue([mockEvent]);

      const result = await service.findAllForAdmin();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['createdBy'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockEvent]);
    });
  });

  describe('findOne', () => {
    it('should return a published event by id', async () => {
      const publishedEvent = { ...mockEvent, status: EventStatus.PUBLISHED };
      mockRepository.findOne.mockResolvedValue(publishedEvent);

      const result = await service.findOne(mockEvent.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockEvent.id },
        relations: ['createdBy'],
      });
      expect(result).toEqual(publishedEvent);
    });

    it('should throw NotFoundException if event not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for unpublished event when includePrivate is false', async () => {
      mockRepository.findOne.mockResolvedValue(mockEvent); // Draft status

      await expect(service.findOne(mockEvent.id, false)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return unpublished event when includePrivate is true', async () => {
      mockRepository.findOne.mockResolvedValue(mockEvent);

      const result = await service.findOne(mockEvent.id, true);

      expect(result).toEqual(mockEvent);
    });
  });

  describe('update', () => {
    const updateEventDto = {
      title: 'Updated Event Title',
      capacity: 150,
    };

    it('should update an event', async () => {
      const existingEvent = { ...mockEvent, status: EventStatus.DRAFT };
      mockRepository.findOne.mockResolvedValue(existingEvent);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const updatedEvent = { ...existingEvent, ...updateEventDto };
      mockRepository.findOne
        .mockResolvedValueOnce(existingEvent)
        .mockResolvedValueOnce(updatedEvent);

      const result = await service.update(
        mockEvent.id,
        updateEventDto,
        mockUser,
      );

      expect(mockRepository.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException if capacity is less than registered count', async () => {
      const eventWithRegistrations = { ...mockEvent, registeredCount: 50 };
      mockRepository.findOne.mockResolvedValue(eventWithRegistrations);

      await expect(
        service.update(mockEvent.id, { capacity: 30 }, mockUser),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete an event with no registrations', async () => {
      mockRepository.findOne.mockResolvedValue(mockEvent);
      mockRepository.remove.mockResolvedValue(mockEvent);

      await service.remove(mockEvent.id, mockUser);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockEvent);
    });

    it('should throw BadRequestException if event has registrations', async () => {
      const eventWithRegistrations = { ...mockEvent, registeredCount: 10 };
      mockRepository.findOne.mockResolvedValue(eventWithRegistrations);

      await expect(service.remove(mockEvent.id, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('publish', () => {
    it('should publish a draft event', async () => {
      const draftEvent = { ...mockEvent, status: EventStatus.DRAFT };
      mockRepository.findOne.mockResolvedValue(draftEvent);
      mockRepository.save.mockResolvedValue({
        ...draftEvent,
        status: EventStatus.PUBLISHED,
      });

      const result = await service.publish(mockEvent.id);

      expect(result.status).toBe(EventStatus.PUBLISHED);
    });

    it('should throw BadRequestException if event is not draft', async () => {
      const publishedEvent = { ...mockEvent, status: EventStatus.PUBLISHED };
      mockRepository.findOne.mockResolvedValue(publishedEvent);

      await expect(service.publish(mockEvent.id)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if event start date has passed', async () => {
      const pastEvent = {
        ...mockEvent,
        status: EventStatus.DRAFT,
        startDate: pastDate,
      };
      mockRepository.findOne.mockResolvedValue(pastEvent);

      await expect(service.publish(mockEvent.id)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('cancel', () => {
    it('should cancel a published event', async () => {
      const publishedEvent = { ...mockEvent, status: EventStatus.PUBLISHED };
      mockRepository.findOne.mockResolvedValue(publishedEvent);
      mockRepository.save.mockResolvedValue({
        ...publishedEvent,
        status: EventStatus.CANCELLED,
      });

      const result = await service.cancel(mockEvent.id);

      expect(result.status).toBe(EventStatus.CANCELLED);
    });

    it('should throw BadRequestException if event is already cancelled', async () => {
      const cancelledEvent = { ...mockEvent, status: EventStatus.CANCELLED };
      mockRepository.findOne.mockResolvedValue(cancelledEvent);

      await expect(service.cancel(mockEvent.id)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if event is completed', async () => {
      const completedEvent = { ...mockEvent, status: EventStatus.COMPLETED };
      mockRepository.findOne.mockResolvedValue(completedEvent);

      await expect(service.cancel(mockEvent.id)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findUpcoming', () => {
    it('should return upcoming published events', async () => {
      const upcomingEvent = { ...mockEvent, status: EventStatus.PUBLISHED };
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([upcomingEvent]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findUpcoming(10);

      expect(queryBuilder.where).toHaveBeenCalledWith(
        'event.status = :status',
        {
          status: EventStatus.PUBLISHED,
        },
      );
      expect(queryBuilder.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual([upcomingEvent]);
    });
  });

  describe('findFeatured', () => {
    it('should return featured published events', async () => {
      const featuredEvent = {
        ...mockEvent,
        status: EventStatus.PUBLISHED,
        isFeatured: true,
      };
      mockRepository.find.mockResolvedValue([featuredEvent]);

      const result = await service.findFeatured();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          status: EventStatus.PUBLISHED,
          isFeatured: true,
        },
        order: { startDate: 'ASC' },
        take: 5,
      });
      expect(result).toEqual([featuredEvent]);
    });
  });
});
