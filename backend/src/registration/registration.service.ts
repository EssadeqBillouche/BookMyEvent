import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration, RegistrationStatus } from './entities/registration.entity';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { User } from '../user/entities/user.entity';
import { Event, EventStatus } from '../event/entities/event.entity';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  /**
   * Register a user for an event
   */
  async create(createRegistrationDto: CreateRegistrationDto, user: User): Promise<Registration> {
    const { eventId, notes } = createRegistrationDto;

    // Find the event
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if event is published
    if (event.status !== EventStatus.PUBLISHED) {
      throw new BadRequestException('Cannot register for an unpublished event');
    }

    // Check if event has capacity
    if (event.registeredCount >= event.capacity) {
      throw new BadRequestException('Event is at full capacity');
    }

    // Check if event date has passed
    if (new Date(event.startDate) < new Date()) {
      throw new BadRequestException('Cannot register for a past event');
    }

    // Check if user is already registered
    const existingRegistration = await this.registrationRepository.findOne({
      where: { userId: user.id, eventId },
    });
    if (existingRegistration) {
      throw new ConflictException('You are already registered for this event');
    }

    // Create registration
    const registration = this.registrationRepository.create({
      userId: user.id,
      eventId,
      notes,
      status: RegistrationStatus.CONFIRMED,
    });

    // Save registration
    const savedRegistration = await this.registrationRepository.save(registration);

    // Increment event registered count
    await this.eventRepository.increment({ id: eventId }, 'registeredCount', 1);

    return this.findOne(savedRegistration.id);
  }

  /**
   * Get all registrations (Admin only)
   */
  async findAll(): Promise<Registration[]> {
    return this.registrationRepository.find({
      relations: ['user', 'event'],
      order: { registeredAt: 'DESC' },
    });
  }

  /**
   * Get registrations for a specific event (Admin only)
   */
  async findByEvent(eventId: string): Promise<Registration[]> {
    return this.registrationRepository.find({
      where: { eventId },
      relations: ['user', 'event'],
      order: { registeredAt: 'DESC' },
    });
  }

  /**
   * Get registrations for the current user
   */
  async findByUser(userId: string): Promise<Registration[]> {
    return this.registrationRepository.find({
      where: { userId },
      relations: ['user', 'event'],
      order: { registeredAt: 'DESC' },
    });
  }

  /**
   * Get a single registration
   */
  async findOne(id: string): Promise<Registration> {
    const registration = await this.registrationRepository.findOne({
      where: { id },
      relations: ['user', 'event'],
    });
    if (!registration) {
      throw new NotFoundException('Registration not found');
    }
    return registration;
  }

  /**
   * Check if user is registered for an event
   */
  async isUserRegistered(userId: string, eventId: string): Promise<boolean> {
    const registration = await this.registrationRepository.findOne({
      where: { userId, eventId, status: RegistrationStatus.CONFIRMED },
    });
    return !!registration;
  }

  /**
   * Update registration (Admin only)
   */
  async update(id: string, updateRegistrationDto: UpdateRegistrationDto): Promise<Registration> {
    const registration = await this.findOne(id);
    Object.assign(registration, updateRegistrationDto);
    return this.registrationRepository.save(registration);
  }

  /**
   * Cancel registration (User cancels their own registration)
   */
  async cancel(id: string, user: User): Promise<Registration> {
    const registration = await this.findOne(id);

    // Check if registration belongs to user
    if (registration.userId !== user.id) {
      throw new BadRequestException('You can only cancel your own registrations');
    }

    // Check if already cancelled
    if (registration.status === RegistrationStatus.CANCELLED) {
      throw new BadRequestException('Registration is already cancelled');
    }

    // Update status
    registration.status = RegistrationStatus.CANCELLED;
    const savedRegistration = await this.registrationRepository.save(registration);

    // Decrement event registered count
    await this.eventRepository.decrement({ id: registration.eventId }, 'registeredCount', 1);

    return savedRegistration;
  }

  /**
   * Delete registration (Admin only)
   */
  async remove(id: string): Promise<void> {
    const registration = await this.findOne(id);
    
    // Decrement count if registration was confirmed
    if (registration.status === RegistrationStatus.CONFIRMED) {
      await this.eventRepository.decrement({ id: registration.eventId }, 'registeredCount', 1);
    }

    await this.registrationRepository.delete(id);
  }

  /**
   * Get registration statistics for an event
   */
  async getEventStats(eventId: string): Promise<{
    total: number;
    confirmed: number;
    cancelled: number;
    attended: number;
  }> {
    const registrations = await this.registrationRepository.find({
      where: { eventId },
    });

    return {
      total: registrations.length,
      confirmed: registrations.filter(r => r.status === RegistrationStatus.CONFIRMED).length,
      cancelled: registrations.filter(r => r.status === RegistrationStatus.CANCELLED).length,
      attended: registrations.filter(r => r.status === RegistrationStatus.ATTENDED).length,
    };
  }
}
