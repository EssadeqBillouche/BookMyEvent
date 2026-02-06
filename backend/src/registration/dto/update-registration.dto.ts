import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RegistrationStatus } from '../entities/registration.entity';

export class UpdateRegistrationDto {
  @IsOptional()
  @IsEnum(RegistrationStatus)
  status?: RegistrationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
