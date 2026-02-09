/**
 * Ticket Module
 *
 * Feature module for ticket generation and management.
 * Provides PDF ticket generation for confirmed event registrations.
 *
 * Dependencies:
 * - Registration entity for fetching registration data
 * - PDFKit for PDF generation
 *
 * @module ticket
 * @author EventBook Team
 * @since 1.0.0
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Registration } from '../registration/entities/registration.entity';

@Module({
  imports: [
    // Import Registration entity for database operations
    TypeOrmModule.forFeature([Registration]),
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService], // Export for potential use in other modules (e.g., email service)
})
export class TicketModule {}
