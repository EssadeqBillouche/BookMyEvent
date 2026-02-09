/**
 * Ticket Service Unit Tests
 *
 * Test suite for the TicketService covering:
 * - PDF ticket generation
 * - Authorization validation
 * - Status validation (CONFIRMED only)
 *
 * @module ticket
 * @author EventBook Team
 * @since 1.0.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TicketService } from './ticket.service';
import {
  Registration,
  RegistrationStatus,
} from '../registration/entities/registration.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { Event, EventStatus } from '../event/entities/event.entity';

describe('TicketService', () => {
  let service: TicketService;
  let registrationRepository: jest.Mocked<Repository<Registration>>;

  // Mock data
  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.PARTICIPANT,
    profilePicture: '',
  };

  const mockEvent: Event = {
    id: 'event-123',
    title: 'Tech Conference 2026',
    description: 'A great tech conference',
    startDate: new Date('2026-03-15T10:00:00'),
    endDate: new Date('2026-03-15T18:00:00'),
    location: 'Convention Center, New York',
    capacity: 100,
    registeredCount: 50,
    status: EventStatus.PUBLISHED,
    imageUrl: '',
    price: 0,
    isFeatured: false,
    createdById: 'admin-123',
    createdBy: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRegistration: Registration = {
    id: 'reg-123',
    userId: 'user-123',
    eventId: 'event-123',
    status: RegistrationStatus.CONFIRMED,
    notes: '',
    registeredAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
    event: mockEvent,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: getRepositoryToken(Registration),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
    registrationRepository = module.get(getRepositoryToken(Registration));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTicket', () => {
    it('should generate a PDF ticket for a confirmed registration', async () => {
      // Arrange
      registrationRepository.findOne.mockResolvedValue(mockRegistration);

      // Act
      const result = await service.generateTicket('reg-123', 'user-123');

      // Assert
      expect(result).toBeDefined();
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.contentType).toBe('application/pdf');
      expect(result.filename).toContain('ticket_');
      expect(result.filename).toContain('.pdf');
      expect(registrationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'reg-123' },
        relations: ['user', 'event'],
      });
    });

    it('should throw NotFoundException when registration does not exist', async () => {
      // Arrange
      registrationRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.generateTicket('non-existent', 'user-123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user does not own the registration', async () => {
      // Arrange
      registrationRepository.findOne.mockResolvedValue(mockRegistration);

      // Act & Assert
      await expect(
        service.generateTicket('reg-123', 'different-user'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when registration is not confirmed (PENDING)', async () => {
      // Arrange
      const pendingRegistration = {
        ...mockRegistration,
        status: RegistrationStatus.PENDING,
      };
      registrationRepository.findOne.mockResolvedValue(pendingRegistration);

      // Act & Assert
      await expect(
        service.generateTicket('reg-123', 'user-123'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when registration is cancelled', async () => {
      // Arrange
      const cancelledRegistration = {
        ...mockRegistration,
        status: RegistrationStatus.CANCELLED,
      };
      registrationRepository.findOne.mockResolvedValue(cancelledRegistration);

      // Act & Assert
      await expect(
        service.generateTicket('reg-123', 'user-123'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('canDownloadTicket', () => {
    it('should return true for a confirmed registration owned by user', async () => {
      // Arrange
      registrationRepository.findOne.mockResolvedValue(mockRegistration);

      // Act
      const result = await service.canDownloadTicket('reg-123', 'user-123');

      // Assert
      expect(result).toBe(true);
      expect(registrationRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 'reg-123',
          userId: 'user-123',
          status: RegistrationStatus.CONFIRMED,
        },
      });
    });

    it('should return false when no matching registration found', async () => {
      // Arrange
      registrationRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.canDownloadTicket('reg-123', 'user-123');

      // Assert
      expect(result).toBe(false);
    });
  });
});
