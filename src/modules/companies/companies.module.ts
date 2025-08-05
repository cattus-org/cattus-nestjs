import { forwardRef, Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Company } from './entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from '../aws/s3/s3.module';
import { CompaniesRepository } from './companies.repository';
import { UsersModule } from '../users/users.module';
import { AppLogsModule } from '../app-logs/app-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    S3Module,
    forwardRef(() => UsersModule),
    AppLogsModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesRepository],
  exports: [CompaniesService],
})
export class CompaniesModule {}
