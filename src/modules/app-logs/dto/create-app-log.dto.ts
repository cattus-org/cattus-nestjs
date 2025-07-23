import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAppLogDto {
  @IsOptional()
  user?: number | string;

  @IsOptional()
  @IsNumber()
  companyId?: number;

  @IsString()
  action: string;

  @IsString()
  resource: string;

  @IsOptional()
  details?: string;
}
