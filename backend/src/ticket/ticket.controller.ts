/**
 * Ticket Controller
 *
 * Handles HTTP requests for ticket operations including
 * PDF ticket generation and secure download routes.
 *
 * Security Features:
 * - JWT authentication required
 * - User authorization (can only download own tickets)
 * - Registration status validation (must be CONFIRMED)
 *
 * @module ticket
 * @author EventBook Team
 * @since 1.0.0
 */

import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('tickets')
@UseGuards(JwtAuthGuard) // All routes require authentication
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  /**
   * Download PDF ticket for a confirmed registration
   *
   * This endpoint generates and serves a PDF ticket that can be
   * used as proof of entry for confirmed event registrations.
   *
   * Security validations:
   * 1. User must be authenticated (JWT)
   * 2. Registration must belong to the authenticated user
   * 3. Registration status must be CONFIRMED
   *
   * @route GET /tickets/:registrationId/download
   *
   * @param registrationId - UUID of the registration to generate ticket for
   * @param user - Current authenticated user (injected by decorator)
   * @param res - Express response object for streaming PDF
   *
   * @returns PDF file download
   *
   * @throws {401} - Unauthorized if not authenticated
   * @throws {403} - Forbidden if registration not owned by user or not confirmed
   * @throws {404} - Not found if registration doesn't exist
   *
   * @example
   * ```typescript
   * // Frontend usage
   * const response = await fetch('/tickets/{registrationId}/download', {
   *   credentials: 'include',
   * });
   * const blob = await response.blob();
   * const url = window.URL.createObjectURL(blob);
   * // Trigger download
   * ```
   */
  @Get(':registrationId/download')
  async downloadTicket(
    @Param('registrationId', ParseUUIDPipe) registrationId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    // Generate the PDF ticket
    const ticketData = await this.ticketService.generateTicket(
      registrationId,
      user.id,
    );

    // Set response headers for PDF download
    res.setHeader('Content-Type', ticketData.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${ticketData.filename}"`,
    );
    res.setHeader('Content-Length', ticketData.buffer.length);

    // Prevent caching of ticket (security measure)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Send the PDF buffer
    res.status(HttpStatus.OK).send(ticketData.buffer);
  }

  /**
   * Check if ticket download is available for a registration
   *
   * This is a lightweight endpoint that checks if a ticket can be
   * downloaded without actually generating the PDF. Useful for
   * UI conditional rendering.
   *
   * @route GET /tickets/:registrationId/check
   *
   * @param registrationId - UUID of the registration to check
   * @param user - Current authenticated user
   *
   * @returns { canDownload: boolean } - Whether ticket download is available
   *
   * @example
   * ```typescript
   * // Frontend usage
   * const { canDownload } = await api.get(`/tickets/${regId}/check`);
   * if (canDownload) {
   *   // Show download button
   * }
   * ```
   */
  @Get(':registrationId/check')
  async checkTicketAvailability(
    @Param('registrationId', ParseUUIDPipe) registrationId: string,
    @CurrentUser() user: User,
  ): Promise<{ canDownload: boolean }> {
    const canDownload = await this.ticketService.canDownloadTicket(
      registrationId,
      user.id,
    );

    return { canDownload };
  }
}
