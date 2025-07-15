import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Cattus LTDA' })
  @IsString()
  @MinLength(5)
  name: string;

  @ApiProperty({ example: '12312389032189' })
  @IsString()
  @MinLength(14)
  @MaxLength(14)
  cnpj: string;

  @ApiProperty({ example: '(13)99687-2580' })
  @IsString()
  phone: string;

  @IsNumber()
  @IsOptional()
  responsible?: { id: number };
  //colocar como opcional a url de logo?
}
