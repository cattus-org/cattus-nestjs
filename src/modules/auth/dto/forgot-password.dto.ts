import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'email@example.com', type: 'string' })
  @IsString()
  @IsEmail()
  email: string;
}
