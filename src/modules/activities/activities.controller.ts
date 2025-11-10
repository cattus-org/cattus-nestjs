import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { successResponse } from 'src/common/helpers/response.helper';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Public()
  @UseGuards(ApiKeyGuard)
  async create(@Body() createActivityDto: CreateActivityDto) {
    const activity = await this.activitiesService.create(createActivityDto);
    return successResponse(activity, 'activity created successfully');
  }

  @HttpCode(HttpStatus.OK)
  @Get('camera/:id')
  @ApiBearerAuth('jwt')
  @ApiResponse({
    description: 'returns a list of activities from a specific camera',
  })
  async findByCamera(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Query() paginationDTO: PaginationDTO,
  ) {
    const activities = await this.activitiesService.findAllByCamera(
      +id,
      user,
      paginationDTO,
    );
    return successResponse(activities, 'activities found successfully');
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/cat')
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'returns a list of activities' })
  async findByCat(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Query() paginationDTO: PaginationDTO,
  ) {
    const activities = await this.activitiesService.findAllByCat(
      +id,
      user,
      paginationDTO,
    );

    return successResponse(activities, 'activities successfully rescued');
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/company')
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'returns a list of activities' })
  async findByCompany(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Query() paginationDTO: PaginationDTO,
  ) {
    const activities = await this.activitiesService.findAllByCompany(
      +id,
      user,
      paginationDTO,
    );

    return successResponse(activities, 'activities successfully rescued');
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @Public()
  @UseGuards(ApiKeyGuard)
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    const activity = await this.activitiesService.update(
      +id,
      updateActivityDto,
    );

    return successResponse(activity, 'activity updated successfully');
  }
}
