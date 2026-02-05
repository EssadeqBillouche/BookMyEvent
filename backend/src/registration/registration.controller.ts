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
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { User, UserRole } from '../user/entities/user.entity';

@Controller('registrations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  /**
   * Register for an event (Authenticated users)
   * POST /registrations
   */
  @Post()
  create(@Body() createRegistrationDto: CreateRegistrationDto, @CurrentUser() user: User) {
    return this.registrationService.create(createRegistrationDto, user);
  }

  /**
   * Get all registrations (Admin only)
   * GET /registrations
   */
  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.registrationService.findAll();
  }

  /**
   * Get registrations for a specific event (Admin only)
   * GET /registrations/event/:eventId
   */
  @Get('event/:eventId')
  @Roles(UserRole.ADMIN)
  findByEvent(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.registrationService.findByEvent(eventId);
  }

  /**
   * Get my registrations (Current user)
   * GET /registrations/my
   */
  @Get('my')
  findMyRegistrations(@CurrentUser() user: User) {
    return this.registrationService.findByUser(user.id);
  }

  /**
   * Check if user is registered for an event (Public - needs auth)
   * GET /registrations/check/:eventId
   */
  @Get('check/:eventId')
  async checkRegistration(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @CurrentUser() user: User,
  ) {
    const isRegistered = await this.registrationService.isUserRegistered(user.id, eventId);
    return { isRegistered };
  }

  /**
   * Get event registration statistics (Admin only)
   * GET /registrations/stats/:eventId
   */
  @Get('stats/:eventId')
  @Roles(UserRole.ADMIN)
  getEventStats(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.registrationService.getEventStats(eventId);
  }

  /**
   * Get a single registration (Admin or owner)
   * GET /registrations/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.registrationService.findOne(id);
  }

  /**
   * Update registration (Admin only)
   * PATCH /registrations/:id
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN)
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
  cancel(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.registrationService.cancel(id, user);
  }

  /**
   * Delete registration (Admin only)
   * DELETE /registrations/:id
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.registrationService.remove(id);
  }
}
