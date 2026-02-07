import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../../user/entities/user.entity';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEnum(UserRole, { message: 'Role must be either admin or participant' })
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsNotEmpty({ message: 'first name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'first name is required' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'first name is required' })
  profilePicture: string;
}
