import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Vinicius Gabriel Leal' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  name: string;

  @ApiProperty({ example: 'vgl@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senhaForte@123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'não sei ainda' })
  @IsNumber()
  @IsOptional()
  company?: number;
}
