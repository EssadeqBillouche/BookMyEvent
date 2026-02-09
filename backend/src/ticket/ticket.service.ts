/**
 * Ticket Service
 *
 * Generates PDF tickets for confirmed event registrations.
 * Uses PDFKit library to create professional, branded PDF tickets
 * that serve as proof of entry for participants.
 *
 * @module ticket
 * @author EventBook Team
 * @since 1.0.0
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PDFDocument from 'pdfkit';
import {
  Registration,
  RegistrationStatus,
} from '../registration/entities/registration.entity';

/**
 * Interface representing the generated ticket data
 * Returned when streaming is not desired
 */
export interface TicketData {
  buffer: Buffer;
  filename: string;
  contentType: string;
}

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);

  constructor(
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
  ) {}

  /**
   * Generate a PDF ticket for a confirmed registration
   *
   * This method validates that:
   * 1. The registration exists
   * 2. The registration belongs to the requesting user
   * 3. The registration status is CONFIRMED
   *
   * @param registrationId - UUID of the registration
   * @param userId - UUID of the requesting user (for authorization)
   * @returns Promise containing the PDF buffer and metadata
   * @throws NotFoundException - Registration not found
   * @throws ForbiddenException - Registration not confirmed or doesn't belong to user
   *
   * @example
   * ```typescript
   * const ticketData = await ticketService.generateTicket(registrationId, userId);
   * res.setHeader('Content-Type', ticketData.contentType);
   * res.setHeader('Content-Disposition', `attachment; filename="${ticketData.filename}"`);
   * res.send(ticketData.buffer);
   * ```
   */
  async generateTicket(registrationId: string, userId: string): Promise<TicketData> {
    this.logger.log(`Generating ticket for registration: ${registrationId}`);

    // Fetch registration with related event and user data
    const registration = await this.registrationRepository.findOne({
      where: { id: registrationId },
      relations: ['user', 'event'],
    });

    // Validate registration exists
    if (!registration) {
      this.logger.warn(`Registration not found: ${registrationId}`);
      throw new NotFoundException('Registration not found');
    }

    // Validate registration belongs to the requesting user
    if (registration.userId !== userId) {
      this.logger.warn(
        `Unauthorized ticket download attempt. User: ${userId}, Registration owner: ${registration.userId}`,
      );
      throw new ForbiddenException(
        'You can only download tickets for your own registrations',
      );
    }

    // Validate registration status is CONFIRMED
    if (registration.status !== RegistrationStatus.CONFIRMED) {
      this.logger.warn(
        `Ticket download attempted for non-confirmed registration. Status: ${registration.status}`,
      );
      throw new ForbiddenException(
        'Tickets can only be downloaded for confirmed registrations. Current status: ' +
          registration.status,
      );
    }

    // Generate the PDF ticket
    const buffer = await this.createTicketPdf(registration);

    // Create a sanitized filename
    const sanitizedEventTitle = registration.event.title
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    const filename = `ticket_${sanitizedEventTitle}_${registration.id.slice(0, 8)}.pdf`;

    this.logger.log(
      `Ticket generated successfully for registration: ${registrationId}`,
    );

    return {
      buffer,
      filename,
      contentType: 'application/pdf',
    };
  }

  /**
   * Create the actual PDF document using PDFKit
   *
   * This method creates a professionally styled PDF ticket with:
   * - Event branding and details
   * - Attendee information
   * - Registration confirmation number
   * - QR code placeholder (can be extended)
   * - Event date, time, and location
   *
   * @param registration - The registration entity with loaded relations
   * @returns Promise<Buffer> - The generated PDF as a buffer
   */
  private async createTicketPdf(registration: Registration): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        // Initialize PDF document with A4 size
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
          info: {
            Title: `Event Ticket - ${registration.event.title}`,
            Author: 'EventBook',
            Subject: 'Event Registration Ticket',
            Keywords: 'ticket, event, registration',
            Creator: 'EventBook Ticket Service',
          },
        });

        // Collect PDF data chunks
        const chunks: Buffer[] = [];
        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Define colors for consistent styling
        const colors = {
          primary: '#1a365d', // Deep navy blue
          secondary: '#2d3748', // Dark gray
          accent: '#d69e2e', // Warm gold
          light: '#f7fafc', // Light gray background
          border: '#e2e8f0', // Border color
          success: '#38a169', // Success green
        };

        // === HEADER SECTION ===
        this.drawHeader(doc, colors);

        // === TICKET TITLE ===
        doc.moveDown(2);
        doc
          .fillColor(colors.primary)
          .fontSize(28)
          .font('Helvetica-Bold')
          .text('EVENT TICKET', { align: 'center' });

        doc.moveDown(0.5);
        doc
          .fillColor(colors.accent)
          .fontSize(12)
          .font('Helvetica')
          .text('Your Entry Pass', { align: 'center' });

        // === DIVIDER LINE ===
        this.drawDivider(doc, colors.accent);

        // === EVENT DETAILS SECTION ===
        doc.moveDown(1);
        this.drawEventDetails(doc, registration, colors);

        // === ATTENDEE DETAILS SECTION ===
        doc.moveDown(1);
        this.drawAttendeeDetails(doc, registration, colors);

        // === CONFIRMATION DETAILS SECTION ===
        doc.moveDown(1);
        this.drawConfirmationDetails(doc, registration, colors);

        // === QR CODE PLACEHOLDER ===
        doc.moveDown(1);
        this.drawQrCodePlaceholder(doc, registration, colors);

        // === FOOTER SECTION ===
        this.drawFooter(doc, colors);

        // Finalize the PDF document
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Draw the header section with branding
   */
  private drawHeader(
    doc: PDFKit.PDFDocument,
    colors: Record<string, string>,
  ): void {
    // Draw header background
    doc.rect(0, 0, doc.page.width, 80).fill(colors.primary);

    // Add logo text
    doc
      .fillColor('#ffffff')
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('EventBook', 50, 30);

    // Add tagline
    doc.fontSize(10).font('Helvetica').text('Your Gateway to Amazing Events', 50, 55);
  }

  /**
   * Draw a decorative divider line
   */
  private drawDivider(
    doc: PDFKit.PDFDocument,
    color: string,
  ): void {
    const startX = 100;
    const endX = doc.page.width - 100;
    const y = doc.y + 10;

    doc
      .strokeColor(color)
      .lineWidth(2)
      .moveTo(startX, y)
      .lineTo(endX, y)
      .stroke();
  }

  /**
   * Draw event details section
   */
  private drawEventDetails(
    doc: PDFKit.PDFDocument,
    registration: Registration,
    colors: Record<string, string>,
  ): void {
    const { event } = registration;
    const startX = 50;
    const boxWidth = doc.page.width - 100;

    // Section title
    doc
      .fillColor(colors.primary)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('EVENT DETAILS', startX, doc.y);

    doc.moveDown(0.5);

    // Draw info box background
    const boxY = doc.y;
    doc.rect(startX, boxY, boxWidth, 100).fill(colors.light);

    // Reset position inside box
    doc.y = boxY + 15;

    // Event title
    doc
      .fillColor(colors.primary)
      .fontSize(18)
      .font('Helvetica-Bold')
      .text(event.title, startX + 15, doc.y, { width: boxWidth - 30 });

    doc.moveDown(0.5);

    // Event date and time
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };

    doc
      .fillColor(colors.secondary)
      .fontSize(11)
      .font('Helvetica')
      .text(
        `📅 ${startDate.toLocaleDateString('en-US', dateOptions)}`,
        startX + 15,
        doc.y,
      )
      .text(
        `🕐 ${startDate.toLocaleTimeString('en-US', timeOptions)} - ${endDate.toLocaleTimeString('en-US', timeOptions)}`,
        startX + 15,
        doc.y + 5,
      )
      .text(`📍 ${event.location}`, startX + 15, doc.y + 10);

    doc.y = boxY + 110;
  }

  /**
   * Draw attendee details section
   */
  private drawAttendeeDetails(
    doc: PDFKit.PDFDocument,
    registration: Registration,
    colors: Record<string, string>,
  ): void {
    const { user } = registration;
    const startX = 50;
    const boxWidth = doc.page.width - 100;

    // Section title
    doc
      .fillColor(colors.primary)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('ATTENDEE INFORMATION', startX, doc.y);

    doc.moveDown(0.5);

    // Draw info box background
    const boxY = doc.y;
    doc.rect(startX, boxY, boxWidth, 60).fill(colors.light);

    // Reset position inside box
    doc.y = boxY + 15;

    // Attendee name and email
    doc
      .fillColor(colors.secondary)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(`${user.firstName} ${user.lastName}`, startX + 15, doc.y);

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`✉️ ${user.email}`, startX + 15, doc.y + 5);

    doc.y = boxY + 70;
  }

  /**
   * Draw confirmation details section
   */
  private drawConfirmationDetails(
    doc: PDFKit.PDFDocument,
    registration: Registration,
    colors: Record<string, string>,
  ): void {
    const startX = 50;
    const boxWidth = doc.page.width - 100;

    // Section title
    doc
      .fillColor(colors.primary)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('CONFIRMATION DETAILS', startX, doc.y);

    doc.moveDown(0.5);

    // Draw info box background with success accent
    const boxY = doc.y;
    doc.rect(startX, boxY, boxWidth, 70).fill(colors.light);

    // Add left border accent
    doc.rect(startX, boxY, 4, 70).fill(colors.success);

    // Reset position inside box
    doc.y = boxY + 15;

    // Confirmation number
    doc
      .fillColor(colors.secondary)
      .fontSize(10)
      .font('Helvetica')
      .text('Confirmation Number:', startX + 20, doc.y);

    doc
      .fillColor(colors.primary)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(registration.id.toUpperCase(), startX + 20, doc.y + 5);

    // Registration date
    const registeredAt = new Date(registration.registeredAt);
    doc
      .fillColor(colors.secondary)
      .fontSize(10)
      .font('Helvetica')
      .text(
        `Registered on: ${registeredAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        startX + 20,
        doc.y + 10,
      );

    // Status badge
    doc
      .fillColor(colors.success)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('✓ CONFIRMED', startX + boxWidth - 120, boxY + 25);

    doc.y = boxY + 80;
  }

  /**
   * Draw QR code placeholder section
   * Note: For production, integrate a QR code library like 'qrcode'
   */
  private drawQrCodePlaceholder(
    doc: PDFKit.PDFDocument,
    registration: Registration,
    colors: Record<string, string>,
  ): void {
    const centerX = doc.page.width / 2;
    const qrSize = 80;

    // Draw placeholder box for QR code
    doc
      .rect(centerX - qrSize / 2, doc.y, qrSize, qrSize)
      .lineWidth(1)
      .strokeColor(colors.border)
      .stroke();

    // Add placeholder text
    doc
      .fillColor(colors.secondary)
      .fontSize(8)
      .font('Helvetica')
      .text('SCAN FOR', centerX - qrSize / 2 + 15, doc.y + 30);

    doc.text('VERIFICATION', centerX - qrSize / 2 + 10, doc.y - 10);

    doc.y = doc.y + qrSize + 20;

    // Add ticket ID below QR
    doc
      .fillColor(colors.secondary)
      .fontSize(8)
      .font('Helvetica')
      .text(`Ticket ID: ${registration.id.slice(0, 8).toUpperCase()}`, {
        align: 'center',
      });
  }

  /**
   * Draw footer section with important notices
   */
  private drawFooter(
    doc: PDFKit.PDFDocument,
    colors: Record<string, string>,
  ): void {
    const footerY = doc.page.height - 100;

    // Draw footer background
    doc.rect(0, footerY, doc.page.width, 100).fill(colors.light);

    // Add important notice
    doc
      .fillColor(colors.secondary)
      .fontSize(9)
      .font('Helvetica-Bold')
      .text('IMPORTANT INFORMATION', 50, footerY + 15);

    doc
      .fontSize(8)
      .font('Helvetica')
      .text(
        '• Please present this ticket (printed or digital) at the event entrance.',
        50,
        footerY + 30,
      )
      .text(
        '• This ticket is non-transferable and valid for one-time entry only.',
        50,
        footerY + 42,
      )
      .text('• Arrive at least 15 minutes before the event start time.', 50, footerY + 54);

    // Add generation timestamp
    doc
      .fillColor(colors.border)
      .fontSize(7)
      .text(
        `Generated by EventBook on ${new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        50,
        footerY + 75,
      );
  }

  /**
   * Validate if a user can download a ticket for a registration
   * Utility method for pre-flight checks
   *
   * @param registrationId - UUID of the registration
   * @param userId - UUID of the user
   * @returns Promise<boolean> - True if user can download
   */
  async canDownloadTicket(
    registrationId: string,
    userId: string,
  ): Promise<boolean> {
    const registration = await this.registrationRepository.findOne({
      where: {
        id: registrationId,
        userId: userId,
        status: RegistrationStatus.CONFIRMED,
      },
    });

    return !!registration;
  }
}
