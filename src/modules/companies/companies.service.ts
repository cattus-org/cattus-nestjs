import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompaniesRepository } from './companies.repository';
import { S3Service } from '../aws/s3/s3.service';
import { AppLogsService } from '../app-logs/app-logs.service';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    private readonly s3Service: S3Service,
    private readonly usersRepository: UsersRepository,
    private readonly appLogsService: AppLogsService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    file: Express.Multer.File,
    userId: number,
  ) {
    try {
      const user = await this.usersRepository.findOneById(userId); // Use o repositório diretamente
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

      user.company = company;
      user.access_level = 'admin';
      await this.usersRepository.update(user);

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

  async findAll() {
    try {
      const companies = await this.companiesRepository.findAll();

      await this.appLogsService.create({
        action: 'findAll',
        resource: 'COMPANIES',
      });

      return companies;
    } catch (error) {
      await this.appLogsService.create({
        action: 'findAll',
        resource: 'COMPANIES',
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async findOneById(id: number) {
    try {
      const company = await this.companiesRepository.findOneById(id);
      if (!company) throw new NotFoundException('company not found');

      await this.appLogsService.create({
        action: 'findOneById',
        resource: 'COMPANIES',
        companyId: id,
      });

      return company;
    } catch (error) {
      await this.appLogsService.create({
        action: 'findOneById',
        resource: 'COMPANIES',
        details: `FAIL: ${error.message}`,
        companyId: id,
      });

      throw error;
    }
  }

  async findOneByCNPJ(cnpj: string) {
    try {
      const company = await this.companiesRepository.findByCnpj(cnpj);

      await this.appLogsService.create({
        action: 'findOneByCnpj',
        resource: 'COMPANIES',
      });

      return company;
    } catch (error) {
      await this.appLogsService.create({
        action: 'findOneByCnpj',
        resource: 'COMPANIES',
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async update(
    id: number,
    user: JwtPayload,
    updateCompanyDto: UpdateCompanyDto,
  ) {
    try {
      if (id !== user.company.id) throw new ForbiddenException('access denied');
      const company = await this.companiesRepository.findOneById(id);
      if (!company) throw new NotFoundException('company not found');

      company.name = updateCompanyDto.name ?? company.name;
      company.phone = updateCompanyDto.phone ?? company.phone;
      company.logotype = updateCompanyDto.logotype ?? company.logotype;

      const updatedCompany = await this.companiesRepository.update(company);

      await this.appLogsService.create({
        action: 'update',
        resource: 'COMPANIES',
        companyId: user.company.id,
        user: user.id.toString(),
      });

      return updatedCompany;
    } catch (error) {
      await this.appLogsService.create({
        action: 'update',
        resource: 'COMPANIES',
        companyId: user.company.id,
        user: user.id.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async softDelete(id: number, user: JwtPayload) {
    try {
      if (id !== user.company.id) throw new ForbiddenException('access denied');
      const company = await this.companiesRepository.findOneById(id);
      if (!company) throw new NotFoundException('company not found');

      const softDeletedCompany = await this.companiesRepository.softDelete(id);

      await this.appLogsService.create({
        action: 'update',
        resource: 'COMPANIES',
        companyId: user.company.id,
        user: user.id.toString(),
      });

      return softDeletedCompany;
    } catch (error) {
      await this.appLogsService.create({
        action: 'update',
        resource: 'COMPANIES',
        companyId: user.company.id,
        user: user.id.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }
}
//TODO - arrumar mensagens de erro
