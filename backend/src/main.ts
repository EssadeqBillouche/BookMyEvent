/**
 * Application Bootstrap
 *
 * Entry point for the NestJS application. Configures middleware, security,
 * validation, and global error handling before starting the HTTP server.
 *
 * @module main
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

/**
 * Bootstrap function initializes and configures the NestJS application.
 *
 * Configuration includes:
 * - Global exception handling for consistent error responses
 * - Input validation and sanitization
 * - Cookie parsing for HTTP-only authentication
 * - CORS configuration for cross-origin requests
 * - HTTP request logging for debugging
 *
 * @async
 * @throws {Error} If application fails to start or port is already in use
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Global Exception Filter
   * Catches all unhandled exceptions and formats them consistently.
   * Provides structured error responses with status codes, messages, and timestamps.
   */
  app.useGlobalFilters(new GlobalExceptionFilter());

  /**
   * Global Validation Pipe
   * Automatically validates incoming requests against DTO class-validator decorators.
   *
   * Options:
   * - whitelist: Strip properties not defined in DTO
   * - forbidNonWhitelisted: Throw error if extra properties are sent
   * - transform: Automatically transform payloads to DTO instances
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * Cookie Parser Middleware
   * Parses Cookie header and populates req.cookies with cookie objects.
   * Required for HTTP-only cookie authentication.
   */
  app.use(cookieParser());

  /**
   * CORS Configuration
   * Enables Cross-Origin Resource Sharing for frontend communication.
   *
   * Security considerations:
   * - origin: Only allow requests from trusted frontend domain
   * - credentials: Required for sending/receiving HTTP-only cookies
   *
   * @security In production, replace with actual frontend domain
   */
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true,
  });

  /**
   * HTTP Request Logger
   * Logs all incoming HTTP requests in development format.
   * Useful for debugging and monitoring API usage.
   *
   * @development Only recommended for development/staging environments
   */
  app.use(morgan('dev'));

  /**
   * Swagger/OpenAPI Documentation
   * Provides interactive API documentation at /api/docs
   *
   * Features:
   * - Interactive API explorer
   * - Request/Response examples
   * - Authentication support
   * - Schema documentation
   */
  const config = new DocumentBuilder()
    .setTitle('BookMyEvent API')
    .setDescription(`
## 🎫 BookMyEvent - Event Management Platform API

A comprehensive REST API for managing events, registrations, and tickets.

### Features
- **Authentication**: Secure cookie-based JWT authentication
- **Events**: Create, manage, and discover events
- **Registrations**: Register for events with approval workflow
- **Tickets**: Generate and download PDF tickets

### Authentication
This API uses **HTTP-only cookie-based authentication**. 
- Login via \`POST /auth/login\` to receive an authentication cookie
- The cookie is automatically sent with subsequent requests
- Use \`POST /auth/logout\` to clear the authentication cookie

### Rate Limiting
API requests are rate-limited to ensure fair usage.

### Support
For issues or questions, please contact the development team.
    `)
    .setVersion('1.0.0')
    .setContact('BookMyEvent Team', 'https://bookmyevent.com', 'support@bookmyevent.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Events', 'Event management endpoints')
    .addTag('Registrations', 'Event registration endpoints')
    .addTag('Tickets', 'Ticket generation and download endpoints')
    .addTag('Users', 'User management endpoints (Admin only)')
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
      description: 'JWT token stored in HTTP-only cookie',
    })
    .addServer('http://localhost:4000', 'Development Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'BookMyEvent API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 30px 0 }
      .swagger-ui .info .title { color: #d4a574 }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  /**
   * Start HTTP Server
   * Binds application to port 4000 and begins listening for requests.
   *
   * @constant {number} PORT - Server port (should be moved to environment variable)
   */
  await app.listen(4000, () => {
    console.log('🚀 Server running on http://localhost:4000');
    console.log('📚 API Documentation: http://localhost:4000/api/docs');
  });
}

// Initialize application
void bootstrap();
