import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ActivityTitle } from 'src/common/constants/activity.constants';

export class CreateActivityDto {
  @ApiProperty({
    description: 'cat id',
    example: 1,
  })
  @IsNumber()
  catId: number;

  @ApiProperty({
    description: 'id of the camera that recorded the activity',
    example: 1,
  })
  @IsNumber()
  cameraId: number;

  @ApiProperty({
    description: 'activity title',
    enum: ActivityTitle,
    example: ActivityTitle.EAT,
  })
  @IsEnum(ActivityTitle)
  title: string;

  @ApiProperty({
    description: 'activity start date and hour',
    example: '2025-08-10T10:00:00Z',
  })
  @IsDateString()
  startedAt: Date;

  @ApiProperty({
    description: 'activity end date and hour',
    example: '2025-08-10T10:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  endedAt?: Date;
}
