import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';
import { Cat } from '../cats/entities/cat.entity';

@Injectable()
export class ActivitiesRepository {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
  ) {}

  async create(createActivity: {
    cat: Cat;
    cameraId: number;
    title: string;
    startedAt: Date;
    endedAt?: Date;
  }) {
    const activity = this.activitiesRepository.create(createActivity);
    return await this.activitiesRepository.save(activity);
  }

  async findAllByCatId(catId: number, limit: number, offset: number) {
    return await this.activitiesRepository.find({
      where: { cat: { id: catId } },
      take: limit,
      skip: offset,
    });
  }

  async findAllByCompanyId(companyId: number, limit: number, offset: number) {
    return await this.activitiesRepository.find({
      where: { cat: { company: { id: companyId } } },
      take: limit,
      skip: offset,
    });
  }

  async findByActivityId(id: number) {
    return await this.activitiesRepository.findOneBy({ id });
  }

  async updateActivity(activity: Activity) {
    return await this.activitiesRepository.save(activity);
  }
}
