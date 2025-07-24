import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { AppLogsModule } from 'src/modules/app-logs/app-logs.module';

@Module({
  imports: [S3Module, AppLogsModule],
  providers: [S3Service],
  controllers: [S3Controller],
  exports: [S3Service],
})
export class S3Module {}
