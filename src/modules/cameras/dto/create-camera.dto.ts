import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCameraDto {
  @ApiProperty({ example: 'camera da cozinha', type: 'string' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://www.google.com/', type: 'string' })
  @IsString()
  url: string;

  @ApiProperty({
    example:
      'https://cattusapi.s3.us-east-1.amazonaws.com/companies/b1c07d45-b3e8-41d2-bff4-74f351bc5001-Capturadetela2025-02-27095601.png',
    type: 'string',
  })
  @IsString()
  thumbnail: string;
}
