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
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { config } from 'process';
import cookieParser from 'cookie-parser';

// Morgan is used for HTTP request logging in development
const morgan = require('morgan')

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
   * Start HTTP Server
   * Binds application to port 4000 and begins listening for requests.
   * 
   * @constant {number} PORT - Server port (should be moved to environment variable)
   */
  await app.listen(4000, () => {
    console.log('server running in port 4000');
  });
}

// Initialize application
bootstrap();
