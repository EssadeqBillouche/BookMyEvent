import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateRegistrationDto {
  @IsUUID()
  eventId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
