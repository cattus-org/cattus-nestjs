import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { CatsModule } from '../cats/cats.module';
import { AppLogsModule } from '../app-logs/app-logs.module';
import { ActivitiesRepository } from './activities.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Activity]), CatsModule, AppLogsModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivitiesRepository],
})
export class ActivitiesModule {}
