import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsOptional, IsInt, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for updating an existing event
 * All fields are optional - only provided fields will be updated
 */
export class UpdateEventDto extends PartialType(CreateEventDto) {
  /**
   * Override capacity with optional validation
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Capacity must be a whole number' })
  @Min(1, { message: 'Capacity must be at least 1' })
  @Max(100000, { message: 'Capacity cannot exceed 100,000' })
  capacity?: number;

  /**
   * Override startDate with optional validation
   */
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Start date must be a valid ISO 8601 date string' },
  )
  startDate?: string;

  /**
   * Override endDate with optional validation
   */
  @IsOptional()
  @IsDateString(
    {},
    { message: 'End date must be a valid ISO 8601 date string' },
  )
  endDate?: string;
}
