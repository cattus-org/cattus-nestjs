import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CatsRepository } from './cats.repository';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { S3Service } from '../aws/s3/s3.service';
import { AppLogsService } from '../app-logs/app-logs.service';

@Injectable()
export class CatsService {
  constructor(
    private readonly catsRepository: CatsRepository,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
    private readonly s3Service: S3Service,
    private readonly appLogsService: AppLogsService,
  ) {}

  async create(
    createCatDto: CreateCatDto,
    petPicture: Express.Multer.File,
    userId: number,
    companyId: number,
  ) {
    try {
      const user = await this.usersService.findOneById(userId);
      const company = await this.companiesService.findOneById(companyId);
      const picture = await this.s3Service.uploadFile(petPicture);

      await this.appLogsService.create({
        user: userId,
        companyId,
        action: 'create',
        resource: 'CATS',
      });

      return await this.catsRepository.create(
        createCatDto,
        picture,
        user,
        company,
      );
    } catch (error) {
      await this.appLogsService.create({
        action: 'create',
        resource: 'CATS',
        companyId,
        user: userId,
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async findAll() {
    return `This action returns all cats`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} cat`;
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  async remove(id: number) {
    return `This action removes a #${id} cat`;
  }
}
