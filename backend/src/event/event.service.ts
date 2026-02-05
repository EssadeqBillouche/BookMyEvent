import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  /**
   * Create a new event (Admin only)
   */
  async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
    // Validate dates
    this.validateEventDates(createEventDto.startDate, createEventDto.endDate);

    const event = this.eventRepository.create({
      ...createEventDto,
      startDate: new Date(createEventDto.startDate),
      endDate: new Date(createEventDto.endDate),
      createdById: user.id,
    });

    return this.eventRepository.save(event);
  }

  /**
   * Get all events (with optional filters)
   */
  async findAll(options?: {
    status?: EventStatus;
    includePrivate?: boolean;
  }): Promise<Event[]> {
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.createdBy', 'createdBy')
      .orderBy('event.startDate', 'ASC');

    // Filter by status if provided
    if (options?.status) {
      queryBuilder.andWhere('event.status = :status', { status: options.status });
    }

    // For public view, only show published events
    if (!options?.includePrivate) {
      queryBuilder.andWhere('event.status = :publishedStatus', {
        publishedStatus: EventStatus.PUBLISHED,
      });
    }

    return queryBuilder.getMany();
  }

  /**
   * Get all events for admin (includes drafts, cancelled, etc.)
   */
  async findAllForAdmin(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get a single event by ID
   */
  async findOne(id: string, includePrivate = false): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    // Check if event is published (for public access)
    if (!includePrivate && event.status !== EventStatus.PUBLISHED) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    return event;
  }

  /**
   * Update an event (Admin only)
   */
  async update(id: string, updateEventDto: UpdateEventDto, user: User): Promise<Event> {
    const event = await this.findOne(id, true);

    // Validate dates if provided
    const startDate = updateEventDto.startDate || event.startDate.toISOString();
    const endDate = updateEventDto.endDate || event.endDate.toISOString();
    this.validateEventDates(startDate, endDate);

    // Validate capacity against registered count
    if (updateEventDto.capacity !== undefined) {
      this.validateCapacity(updateEventDto.capacity, event.registeredCount);
    }

    // Build update data with proper type conversion
    const updateData: Partial<Event> = {};
    
    if (updateEventDto.title !== undefined) updateData.title = updateEventDto.title;
    if (updateEventDto.description !== undefined) updateData.description = updateEventDto.description;
    if (updateEventDto.location !== undefined) updateData.location = updateEventDto.location;
    if (updateEventDto.capacity !== undefined) updateData.capacity = updateEventDto.capacity;
    if (updateEventDto.status !== undefined) updateData.status = updateEventDto.status;
    if (updateEventDto.imageUrl !== undefined) updateData.imageUrl = updateEventDto.imageUrl;
    if (updateEventDto.price !== undefined) updateData.price = updateEventDto.price;
    if (updateEventDto.isFeatured !== undefined) updateData.isFeatured = updateEventDto.isFeatured;
    
    // Convert date strings to Date objects
    if (updateEventDto.startDate) {
      updateData.startDate = new Date(updateEventDto.startDate);
    }
    if (updateEventDto.endDate) {
      updateData.endDate = new Date(updateEventDto.endDate);
    }

    await this.eventRepository.update(id, updateData);
    return this.findOne(id, true);
  }

  /**
   * Delete an event (Admin only)
   */
  async remove(id: string, user: User): Promise<void> {
    const event = await this.findOne(id, true);
    
    // Prevent deletion of events with registrations
    if (event.registeredCount > 0) {
      throw new BadRequestException(
        'Cannot delete event with existing registrations. Cancel the event instead.',
      );
    }

    await this.eventRepository.remove(event);
  }

  /**
   * Publish an event (change status from draft to published)
   */
  async publish(id: string): Promise<Event> {
    const event = await this.findOne(id, true);

    if (event.status !== EventStatus.DRAFT) {
      throw new BadRequestException('Only draft events can be published');
    }

    // Validate event is in the future
    if (new Date(event.startDate) <= new Date()) {
      throw new BadRequestException('Cannot publish an event that has already started');
    }

    event.status = EventStatus.PUBLISHED;
    return this.eventRepository.save(event);
  }

  /**
   * Cancel an event
   */
  async cancel(id: string): Promise<Event> {
    const event = await this.findOne(id, true);

    if (event.status === EventStatus.CANCELLED) {
      throw new BadRequestException('Event is already cancelled');
    }

    if (event.status === EventStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed event');
    }

    event.status = EventStatus.CANCELLED;
    return this.eventRepository.save(event);
  }

  /**
   * Get upcoming public events
   */
  async findUpcoming(limit = 10): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .where('event.status = :status', { status: EventStatus.PUBLISHED })
      .andWhere('event.startDate > :now', { now: new Date() })
      .orderBy('event.startDate', 'ASC')
      .limit(limit)
      .getMany();
  }

  /**
   * Get featured events
   */
  async findFeatured(): Promise<Event[]> {
    return this.eventRepository.find({
      where: {
        status: EventStatus.PUBLISHED,
        isFeatured: true,
      },
      order: { startDate: 'ASC' },
      take: 5,
    });
  }

  /**
   * Validate event dates
   */
  private validateEventDates(startDate: string, endDate: string): void {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      throw new BadRequestException('Start date must be in the future');
    }

    if (end <= start) {
      throw new BadRequestException('End date must be after start date');
    }

    // Optional: Limit event duration (e.g., max 30 days)
    const maxDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    if (end.getTime() - start.getTime() > maxDuration) {
      throw new BadRequestException('Event duration cannot exceed 30 days');
    }
  }

  /**
   * Validate capacity is not less than registered count
   */
  private validateCapacity(newCapacity: number, registeredCount: number): void {
    if (newCapacity < registeredCount) {
      throw new BadRequestException(
        `Capacity cannot be less than the number of registered attendees (${registeredCount})`,
      );
    }
  }
}
