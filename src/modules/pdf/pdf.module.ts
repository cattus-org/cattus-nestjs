import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { S3Module } from '../aws/s3/s3.module';
import { ActivitiesModule } from '../activities/activities.module';
import { AppLogsModule } from '../app-logs/app-logs.module';

@Module({
  imports: [S3Module, ActivitiesModule, AppLogsModule],
  controllers: [PdfController],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}
