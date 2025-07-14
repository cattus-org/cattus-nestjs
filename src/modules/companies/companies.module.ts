import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Company } from './entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from '../aws/s3/s3.module';
import { S3Service } from '../aws/s3/s3.service';
import { CompaniesRepository } from './companies.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), S3Module],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesRepository, S3Service],
})
export class CompaniesModule {}
