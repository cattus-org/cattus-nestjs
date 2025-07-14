import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompaniesRepository } from './companies.repository';
import { S3Service } from '../aws/s3/s3.service';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    private readonly s3Service: S3Service,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, file: Express.Multer.File) {
    try {
      //adicionar lógica pra pegar nome do responsável e atualizar user com a company
      let logotype: string | undefined;
      if (file) {
        logotype = await this.s3Service.uploadFile(file);
      }

      return await this.companiesRepository.create(createCompanyDto, logotype);
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException('cnpj already used');
      }

      //TODO - adicionar um log de erro
      throw new HttpException(
        `fail to create new company: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
