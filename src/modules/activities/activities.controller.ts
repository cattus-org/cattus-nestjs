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
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { successResponse } from 'src/common/helpers/response.helper';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  //bloquear algumas rotas pra só a api poder acessar (create e update)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiBearerAuth('jwt')
  async create(@Body() createActivityDto: CreateActivityDto) {
    const activity = await this.activitiesService.create(createActivityDto);
    return successResponse(activity, 'activity created successfully');
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
  @ApiBearerAuth('jwt')
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
