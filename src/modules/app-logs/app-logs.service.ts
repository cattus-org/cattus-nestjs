import { Injectable } from '@nestjs/common';
import { CreateAppLogDto } from './dto/create-app-log.dto';
import { AppLogsRepository } from './app-logs.repository';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Injectable()
export class AppLogsService {
  constructor(private readonly appLogsRepository: AppLogsRepository) {}

  async create(createAppLogDto: CreateAppLogDto) {
    try {
      await this.appLogsRepository.create(createAppLogDto);
    } catch (error) {
      console.error(error);
    }
  }

  async findAll(companyId: number, paginationDto?: PaginationDTO) {
    const { limit = 30, offset = 0 } = paginationDto;
    return await this.appLogsRepository.findAll(limit, offset, companyId);
  }
}
