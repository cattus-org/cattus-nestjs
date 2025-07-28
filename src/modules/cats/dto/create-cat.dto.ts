import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CatSex } from 'src/common/interfaces/cats.interfaces';

export class CreateCatDto {
  @ApiProperty({ example: 'Xibikus', type: 'string' })
  @IsString()
  name: string;

  @ApiProperty({
    example: '2025-07-20',
    type: 'string',
    description: 'Data de nascimento no formato YYYY-MM-DD',
  })
  @Type(() => Date)
  @IsDate()
  birthDate: Date;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Foto do gato (upload)',
  })
  @IsOptional()
  @IsString()
  picture?: string;

  @ApiProperty({ enum: CatSex, example: CatSex.MALE })
  @IsEnum(CatSex)
  sex: CatSex;

  @ApiPropertyOptional({ example: 'Gosta de brincar com bolinhas' })
  @IsOptional()
  @IsString()
  observations?: string;

  @ApiPropertyOptional({ type: [String], example: ['Raiva', 'Gripe felina'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  vaccines?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Diabetes'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  comorbidities?: string[];

  @ApiPropertyOptional({ example: 4.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  favorite?: boolean;
}
