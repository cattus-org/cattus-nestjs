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

  @ApiProperty({ example: 'email@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senhaForte@1234' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNumber()
  @IsOptional()
  company?: { id: number };
}
