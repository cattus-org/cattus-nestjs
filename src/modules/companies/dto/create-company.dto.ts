import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsString()
  @MinLength(14)
  @MaxLength(14)
  cnpj: string;

  @IsString()
  phone: string;

  @IsNumber()
  @IsOptional()
  responsible?: { id: number };
  //colocar como opcional a url de logo?
}
