import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompaniesRepository } from './companies.repository';
import { S3Service } from '../aws/s3/s3.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    private readonly s3Service: S3Service,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    file: Express.Multer.File,
    userId: number,
  ) {
    try {
      const findedUser = await this.usersService.findOneById(userId);
      if (findedUser.company)
        throw new ConflictException('user already have a company');

      const cnpjAlreadyUsed = await this.companiesRepository.findByCnpj(
        createCompanyDto.cnpj,
      );
      if (cnpjAlreadyUsed) throw new ConflictException('cnpj already used');

      let logotype: string;
      if (file) {
        logotype = await this.s3Service.uploadFile(file);
      }

      const company = await this.companiesRepository.create(
        { ...createCompanyDto, responsible: { id: userId } },
        logotype,
      );

      await this.usersService.addCompany(company.id, userId);

      return company;
    } catch (error) {
      //TODO - adicionar um log de erro
      throw error;
    }
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
