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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiCookieAuth,
} from '@nestjs/swagger';
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

@ApiTags('Events')
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
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create a new event', description: 'Admin only - Creates a new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: User) {
    return this.eventService.create(createEventDto, user);
  }

  /**
   * Get all published events (Public)
   * GET /events
   */
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all published events', description: 'Public endpoint - Returns all published events' })
  @ApiQuery({ name: 'status', required: false, enum: EventStatus })
  @ApiResponse({ status: 200, description: 'List of events' })
  findAll(@Query('status') status?: EventStatus) {
    return this.eventService.findAll({ status });
  }

  /**
   * Get all events for admin management (Admin only)
   * GET /events/admin
   */
  @Get('admin')
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get all events (admin)', description: 'Admin only - Returns all events including drafts' })
  @ApiResponse({ status: 200, description: 'List of all events' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  findAllAdmin() {
    return this.eventService.findAllForAdmin();
  }

  /**
   * Get upcoming events (Public)
   * GET /events/upcoming
   */
  @Get('upcoming')
  @Public()
  @ApiOperation({ summary: 'Get upcoming events', description: 'Public endpoint - Returns upcoming published events' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of upcoming events' })
  findUpcoming(@Query('limit') limit?: number) {
    return this.eventService.findUpcoming(limit);
  }

  /**
   * Get featured events (Public)
   * GET /events/featured
   */
  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured events', description: 'Public endpoint - Returns featured events' })
  @ApiResponse({ status: 200, description: 'List of featured events' })
  findFeatured() {
    return this.eventService.findFeatured();
  }

  /**
   * Get a single event by ID (Public for published events)
   * GET /events/:id
   */
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get event by ID', description: 'Public endpoint - Returns event details' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Event details' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.findOne(id);
  }

  /**
   * Get a single event by ID for admin (includes unpublished)
   * GET /events/:id/admin
   */
  @Get(':id/admin')
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get event by ID (admin)', description: 'Admin only - Returns event including unpublished' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Event details' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findOneAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.findOne(id, true);
  }

  /**
   * Update an event (Admin only)
   * PATCH /events/:id
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update event', description: 'Admin only - Update event details' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
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
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Publish event', description: 'Admin only - Publish a draft event' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Event published successfully' })
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.publish(id);
  }

  /**
   * Cancel an event (Admin only)
   * PATCH /events/:id/cancel
   */
  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Cancel event', description: 'Admin only - Cancel an event' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Event cancelled successfully' })
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.cancel(id);
  }

  /**
   * Delete an event (Admin only)
   * DELETE /events/:id
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete event', description: 'Admin only - Permanently delete an event' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventService.remove(id);
  }
}
