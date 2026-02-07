import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole, User } from '../user/entities/user.entity';
import { EventStatus } from './entities/event.entity';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * Create a new event (Admin only)
   * POST /events
   */
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: User) {
    return this.eventService.create(createEventDto, user);
  }

  /**
   * Get all published events (Public)
   * GET /events
   */
  @Get()
  @Public()
  findAll(@Query('status') status?: EventStatus) {
    return this.eventService.findAll({ status });
  }

  /**
   * Get all events for admin management (Admin only)
   * GET /events/admin
   */
  @Get('admin')
  @Roles(UserRole.ADMIN)
  findAllAdmin() {
    return this.eventService.findAllForAdmin();
  }

  /**
   * Get upcoming events (Public)
   * GET /events/upcoming
   */
  @Get('upcoming')
  @Public()
  findUpcoming(@Query('limit') limit?: number) {
    return this.eventService.findUpcoming(limit);
  }

  /**
   * Get featured events (Public)
   * GET /events/featured
   */
  @Get('featured')
  @Public()
  findFeatured() {
    return this.eventService.findFeatured();
  }

  /**
   * Get a single event by ID (Public for published events)
   * GET /events/:id
   */
  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.findOne(id);
  }

  /**
   * Get a single event by ID for admin (includes unpublished)
   * GET /events/:id/admin
   */
  @Get(':id/admin')
  @Roles(UserRole.ADMIN)
  findOneAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.findOne(id, true);
  }

  /**
   * Update an event (Admin only)
   * PATCH /events/:id
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(id, updateEventDto);
  }

  /**
   * Publish an event (Admin only)
   * PATCH /events/:id/publish
   */
  @Patch(':id/publish')
  @Roles(UserRole.ADMIN)
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.publish(id);
  }

  /**
   * Cancel an event (Admin only)
   * PATCH /events/:id/cancel
   */
  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN)
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.cancel(id);
  }

  /**
   * Delete an event (Admin only)
   * DELETE /events/:id
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.remove(id);
  }
}
