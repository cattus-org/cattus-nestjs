import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { CatsRepository } from './cats.repository';
import { S3Module } from '../aws/s3/s3.module';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';
import { AppLogsModule } from '../app-logs/app-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cat]),
    S3Module,
    UsersModule,
    CompaniesModule,
    AppLogsModule,
  ],
  controllers: [CatsController],
  providers: [CatsService, CatsRepository],
  exports: [CatsRepository],
})
export class CatsModule {}
