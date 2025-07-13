import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'email@example.com',
    description: 'email do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'senhaForte@1234',
    description: 'senha do usuário',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
