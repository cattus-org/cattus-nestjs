import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { AppLogsService } from '../app-logs/app-logs.service';
import { ActivitiesRepository } from './activities.repository';
import { CatsRepository } from '../cats/cats.repository';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly activitiesRepository: ActivitiesRepository,
    private readonly catsRepository: CatsRepository,
    private readonly appLogsService: AppLogsService,
  ) {}

  async create(createActivityDto: CreateActivityDto) {
    try {
      const cat = await this.catsRepository.findByIdWithoutCompany(
        createActivityDto.catId,
      );
      if (!cat) throw new NotFoundException('cat not found');

      const newActivity = await this.activitiesRepository.create({
        cat,
        title: createActivityDto.title,
        startedAt: createActivityDto.startedAt,
        endedAt: createActivityDto.endedAt,
      });

      await this.appLogsService.create({
        action: 'create',
        resource: 'ACTIVITIES',
      });

      return newActivity;
    } catch (error) {
      await this.appLogsService.create({
        action: 'create',
        resource: 'ACTIVITIES',
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async findAllByCat(
    id: number,
    user: JwtPayload,
    paginationDTO?: PaginationDTO,
  ) {
    try {
      const { limit = 30, offset = 0 } = paginationDTO;
      const activities = await this.activitiesRepository.findAllByCatId(
        id,
        limit,
        offset,
      );

      await this.appLogsService.create({
        action: 'findAllByCat',
        resource: 'ACTIVITIES',
        companyId: user.company.id,
        user: user.id.toString(),
      });

      return activities;
    } catch (error) {
      await this.appLogsService.create({
        action: 'findAllByCat',
        resource: 'ACTIVITIES',
        companyId: user.company.id,
        user: user.id.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async findAllByCompany(
    id: number,
    user: JwtPayload,
    paginationDTO?: PaginationDTO,
  ) {
    try {
      const { limit = 30, offset = 0 } = paginationDTO;
      const activities = await this.activitiesRepository.findAllByCompanyId(
        id,
        limit,
        offset,
      );

      await this.appLogsService.create({
        action: 'findAllByCat',
        resource: 'ACTIVITIES',
        companyId: user.company.id,
        user: user.id.toString(),
      });

      return activities;
    } catch (error) {
      await this.appLogsService.create({
        action: 'findAllByCat',
        resource: 'ACTIVITIES',
        companyId: user.company.id,
        user: user.id.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async update(id: number, updateActivityDto: UpdateActivityDto) {
    try {
      const activity = await this.activitiesRepository.findByActivityId(id);
      if (!activity) throw new NotFoundException('activity not found');

      activity.endedAt = updateActivityDto.endedAt;

      const updatedActivity =
        await this.activitiesRepository.updateActivity(activity);

      await this.appLogsService.create({
        action: 'update',
        resource: 'ACTIVITIES',
      });

      return updatedActivity;
    } catch (error) {
      await this.appLogsService.create({
        action: 'create',
        resource: 'ACTIVITIES',
        details: `FAIL: ${error.message}`,
      });
    }
  }
}
