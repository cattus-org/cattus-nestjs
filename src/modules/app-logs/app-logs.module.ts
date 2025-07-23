import { Module } from '@nestjs/common';
import { AppLogsService } from './app-logs.service';
import { AppLogsController } from './app-logs.controller';
import { AppLogsRepository } from './app-logs.repository';

@Module({
  controllers: [AppLogsController],
  providers: [AppLogsService, AppLogsRepository],
  exports: [AppLogsService],
})
export class AppLogsModule {}
