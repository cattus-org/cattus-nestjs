import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCameraDto } from './create-camera.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCameraDto extends PartialType(CreateCameraDto) {
  @ApiProperty({ example: true, type: 'boolean' })
  @IsBoolean()
  @IsOptional()
  deleted: boolean;
}
