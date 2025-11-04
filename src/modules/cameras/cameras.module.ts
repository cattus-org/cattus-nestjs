import { Module } from '@nestjs/common';
import { CamerasService } from './cameras.service';
import { CamerasController } from './cameras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Camera } from './entities/camera.entity';
import { CompaniesModule } from '../companies/companies.module';
import { UsersModule } from '../users/users.module';
import { AppLogsModule } from '../app-logs/app-logs.module';
import { CamerasRepository } from './cameras.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Camera]),
    CompaniesModule,
    UsersModule,
    AppLogsModule,
  ],
  controllers: [CamerasController],
  providers: [CamerasService, CamerasRepository],
  exports: [CamerasService, CamerasRepository],
})
export class CamerasModule {}
