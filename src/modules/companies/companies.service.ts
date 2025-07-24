import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompaniesRepository } from './companies.repository';
import { S3Service } from '../aws/s3/s3.service';
import { UsersService } from '../users/users.service';
import { AppLogsService } from '../app-logs/app-logs.service';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    private readonly s3Service: S3Service,
    private readonly usersService: UsersService,
    private readonly appLogsService: AppLogsService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    file: Express.Multer.File,
    userId: number,
  ) {
    try {
      //TODO - adicionar validação de arquivos - se veio/n e/ou se é uma imagem - https://docs.nestjs.com/techniques/file-upload
      //TODO - fazer swagger
      const user = await this.usersService.findOneById(userId);
      if (user.company)
        throw new ConflictException('user already have a company');

      const cnpjAlreadyUsed = await this.companiesRepository.findByCnpj(
        createCompanyDto.cnpj,
      );
      if (cnpjAlreadyUsed) throw new ConflictException('cnpj already used');

      const logotype = await this.s3Service.uploadFile(file);

      const company = await this.companiesRepository.create(
        createCompanyDto,
        user,
        logotype,
      );

      await this.usersService.addCompanyAndAccessLevel(company, userId);

      await this.appLogsService.create({
        user: userId.toString(),
        action: 'create',
        resource: 'COMPANIES',
      });

      return company;
    } catch (error) {
      await this.appLogsService.create({
        user: userId.toString(),
        action: 'create',
        resource: 'COMPANIES',
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  findAll() {
    return `This action returns all companies`;
  }

  async findOneById(id: number) {
    try {
      const company = await this.companiesRepository.findOneById(id);
      if (!company) throw new NotFoundException('company not found');

      await this.appLogsService.create({
        action: 'create',
        resource: 'COMPANIES',
        companyId: id,
      });

      return company;
    } catch (error) {
      await this.appLogsService.create({
        action: 'create',
        resource: 'COMPANIES',
        details: `FAIL: ${error.message}`,
        companyId: id,
      });

      throw error;
    }
  }

  async findOneByCNPJ(cnpj: string) {
    return 'This action returns a company finded by CNPJ';
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
