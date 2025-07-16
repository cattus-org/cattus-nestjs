import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppLog } from './entities/app-log.entity';
import { CreateAppLogDto } from './dto/create-app-log.dto';

@Injectable()
export class AppLogsRepository {
  constructor(
    @InjectRepository(AppLog)
    private readonly appLogRepository: Repository<AppLog>,
  ) {}

  async create(createAppLogDto: CreateAppLogDto) {
    const newLog = this.appLogRepository.create(createAppLogDto);
    return await this.appLogRepository.save(newLog);
  }

  async findAll(limit: number, offset: number, companyId: number) {
    return await this.appLogRepository.find({
      where: { companyId },
      take: limit,
      skip: offset,
    });
  }

  //adicionar um findBy - com filtros
}
