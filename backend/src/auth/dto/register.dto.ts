import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../user/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'Password (min 6 characters)', minLength: 6 })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.PARTICIPANT, description: 'User role' })
  @IsEnum(UserRole, { message: 'Role must be either admin or participant' })
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  @IsNotEmpty({ message: 'first name is required' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  @IsNotEmpty({ message: 'first name is required' })
  lastName: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'Profile picture URL' })
  @IsString()
  @IsNotEmpty({ message: 'first name is required' })
  profilePicture: string;
}
