import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAppLogDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  companyId?: number;

  @IsString()
  action: string;

  @IsString()
  resource: string;
}
