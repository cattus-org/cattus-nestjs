import { forwardRef, Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { CatsModule } from '../cats/cats.module';
import { CamerasModule } from '../cameras/cameras.module';
import { AppLogsModule } from '../app-logs/app-logs.module';
import { ActivitiesRepository } from './activities.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    forwardRef(() => CatsModule),
    CamerasModule,
    AppLogsModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivitiesRepository],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
