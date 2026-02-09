import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../user/entities/user.entity';

@ApiTags('Registrations')
@Controller('registrations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  /**
   * Register for an event (Authenticated users)
   * POST /registrations
   */
  @Post()
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Register for an event', description: 'Creates a registration for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Registration created (pending approval)' })
  @ApiResponse({ status: 400, description: 'Already registered or event full' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createRegistrationDto: CreateRegistrationDto,
    @CurrentUser() user: User,
  ) {
    return this.registrationService.create(createRegistrationDto, user);
  }

  /**
   * Get all registrations (Admin only)
   * GET /registrations
   */
  @Get()
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get all registrations', description: 'Admin only - Returns all registrations' })
  @ApiResponse({ status: 200, description: 'List of all registrations' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  findAll() {
    return this.registrationService.findAll();
  }

  /**
   * Get registrations for a specific event (Admin only)
   * GET /registrations/event/:eventId
   */
  @Get('event/:eventId')
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get registrations by event', description: 'Admin only - Returns registrations for a specific event' })
  @ApiParam({ name: 'eventId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'List of event registrations' })
  findByEvent(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.registrationService.findByEvent(eventId);
  }

  /**
   * Get my registrations (Current user)
   * GET /registrations/my
   */
  @Get('my')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get my registrations', description: 'Returns all registrations for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user registrations' })
  findMyRegistrations(@CurrentUser() user: User) {
    return this.registrationService.findByUser(user.id);
  }

  /**
   * Check if user is registered for an event (Public - needs auth)
   * GET /registrations/check/:eventId
   */
  @Get('check/:eventId')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Check registration status', description: 'Check if current user is registered for an event' })
  @ApiParam({ name: 'eventId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Registration status', schema: { example: { isRegistered: true } } })
  async checkRegistration(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @CurrentUser() user: User,
  ) {
    const isRegistered = await this.registrationService.isUserRegistered(
      user.id,
      eventId,
    );
    return { isRegistered };
  }

  /**
   * Get event registration statistics (Admin only)
   * GET /registrations/stats/:eventId
   */
  @Get('stats/:eventId')
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get registration statistics', description: 'Admin only - Returns registration stats for an event' })
  @ApiParam({ name: 'eventId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Event registration statistics' })
  getEventStats(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.registrationService.getEventStats(eventId);
  }

  /**
   * Get a single registration (Admin or owner)
   * GET /registrations/:id
   */
  @Get(':id')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get registration by ID', description: 'Returns a single registration' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Registration details' })
  @ApiResponse({ status: 404, description: 'Registration not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.registrationService.findOne(id);
  }

  /**
   * Update registration (Admin only)
   * PATCH /registrations/:id
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update registration', description: 'Admin only - Update registration details' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Registration updated' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRegistrationDto: UpdateRegistrationDto,
  ) {
    return this.registrationService.update(id, updateRegistrationDto);
  }

  /**
   * Cancel my registration
   * PATCH /registrations/:id/cancel
   */
  @Patch(':id/cancel')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Cancel registration', description: 'Cancel your own registration' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Registration cancelled' })
  cancel(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.registrationService.cancel(id, user);
  }

  /**
   * Validate/approve a pending registration (Admin only)
   * PATCH /registrations/:id/validate
   */
  @Patch(':id/validate')
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Validate registration', description: 'Admin only - Approve a pending registration' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Registration validated/approved' })
  validate(@Param('id', ParseUUIDPipe) id: string) {
    return this.registrationService.validate(id);
  }

  /**
   * Refuse/reject a pending registration (Admin only)
   * PATCH /registrations/:id/refuse
   */
  @Patch(':id/refuse')
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Refuse registration', description: 'Admin only - Reject a pending registration' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Registration refused/rejected' })
  refuse(@Param('id', ParseUUIDPipe) id: string) {
    return this.registrationService.refuse(id);
  }

  /**
   * Get all pending registrations (Admin only)
   * GET /registrations/pending/all
   */
  @Get('pending/all')
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get all pending registrations', description: 'Admin only - Returns all pending registrations' })
  @ApiResponse({ status: 200, description: 'List of pending registrations' })
  findAllPending() {
    return this.registrationService.findAllPending();
  }

  /**
   * Get pending registrations for a specific event (Admin only)
   * GET /registrations/pending/event/:eventId
   */
  @Get('pending/event/:eventId')
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get pending registrations by event', description: 'Admin only - Returns pending registrations for an event' })
  @ApiParam({ name: 'eventId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'List of pending event registrations' })
  findPendingByEvent(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.registrationService.findPendingByEvent(eventId);
  }

  /**
   * Delete registration (Admin only)
   * DELETE /registrations/:id
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete registration', description: 'Admin only - Permanently delete a registration' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Registration deleted' })
  @ApiResponse({ status: 404, description: 'Registration not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.registrationService.remove(id);
  }
}
