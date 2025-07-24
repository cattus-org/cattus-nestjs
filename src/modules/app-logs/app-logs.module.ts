import { Module } from '@nestjs/common';
import { AppLogsService } from './app-logs.service';
import { AppLogsController } from './app-logs.controller';
import { AppLogsRepository } from './app-logs.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLog } from './entities/app-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppLog])],
  controllers: [AppLogsController],
  providers: [AppLogsService, AppLogsRepository],
  exports: [AppLogsService],
})
export class AppLogsModule {}
