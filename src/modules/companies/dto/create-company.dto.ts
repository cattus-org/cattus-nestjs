import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Cattus LTDA', type: 'string' })
  @IsString()
  @MinLength(5)
  name: string;

  @ApiProperty({ example: '12312389032189', type: 'string' })
  @IsString()
  @MinLength(14)
  @MaxLength(14)
  cnpj: string;

  @ApiProperty({ example: '(13)99687-2580', type: 'string' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'URL do logotipo da empresa',
  })
  logotype: string;
}
