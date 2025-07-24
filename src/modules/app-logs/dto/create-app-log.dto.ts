import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAppLogDto {
  @IsOptional()
  @Type(() => String)
  user?: string;

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
