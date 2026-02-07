import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
  IsUrl,
  IsNumber,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { EventStatus } from '../entities/event.entity';

/**
 * DTO for creating a new event
 * Implements validation for capacity and dates as per requirements
 */
export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description: string;

  /**
   * Event start date - must be a valid date in the future
   */
  @IsDateString({}, { message: 'Start date must be a valid ISO 8601 date string' })
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: string;

  /**
   * Event end date - must be a valid date and after start date
   */
  @IsDateString({}, { message: 'End date must be a valid ISO 8601 date string' })
  @IsNotEmpty({ message: 'End date is required' })
  endDate: string;

  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  @MaxLength(500, { message: 'Location cannot exceed 500 characters' })
  location: string;

  /**
   * Event capacity - must be between 1 and 100,000 attendees
   */
  @Type(() => Number)
  @IsInt({ message: 'Capacity must be a whole number' })
  @Min(1, { message: 'Capacity must be at least 1' })
  @Max(100000, { message: 'Capacity cannot exceed 100,000' })
  capacity: number;

  @IsOptional()
  @IsEnum(EventStatus, { message: 'Invalid event status' })
  status?: EventStatus;

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;

  /**
   * Event price - 0 for free events, otherwise must be positive
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price?: number;

  @IsOptional()
  @IsBoolean({ message: 'isFeatured must be a boolean value' })
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean;
}
