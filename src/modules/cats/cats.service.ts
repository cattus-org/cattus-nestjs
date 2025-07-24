import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CatsRepository } from './cats.repository';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { S3Service } from '../aws/s3/s3.service';
import { AppLogsService } from '../app-logs/app-logs.service';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

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

      //transformar os userId em .toString()
      await this.appLogsService.create({
        user: userId.toString(),
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
        user: userId.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async findAll(
    companyId: number,
    userId: number,
    paginationDTO: PaginationDTO,
  ) {
    try {
      const { limit = 15, offset = 0, deleted = false } = paginationDTO;
      const findedCats = await this.catsRepository.findAllByCompany(
        limit,
        offset,
        deleted,
        companyId,
      );

      await this.appLogsService.create({
        action: 'findAll',
        resource: 'CATS',
        companyId,
        user: userId.toString(),
      });

      return findedCats;
    } catch (error) {
      await this.appLogsService.create({
        action: 'findAll',
        resource: 'CATS',
        companyId,
        user: userId.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async findOneById(catId: number, companyId: number, userId: number) {
    try {
      const findedCat = await this.findById(catId, companyId);

      await this.appLogsService.create({
        action: 'findOneById',
        resource: 'CATS',
        companyId,
        user: userId.toString(),
      });

      return findedCat;
    } catch (error) {
      await this.appLogsService.create({
        action: 'findOneById',
        resource: 'CATS',
        companyId,
        user: userId.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async findById(catId: number, companyId: number) {
    try {
      const findedCat = await this.catsRepository.findById(catId, companyId);
      if (!findedCat) throw new NotFoundException('cat not found');

      return findedCat;
    } catch (error) {
      throw error;
    }
  }

  async update(
    catId: number,
    updateCatDto: UpdateCatDto,
    companyId: number,
    userId: number,
  ) {
    try {
      const cat = await this.findById(catId, companyId);

      cat.birthDate = updateCatDto.birthDate ?? cat.birthDate;
      cat.comorbidities = updateCatDto.comorbidities ?? cat.comorbidities;
      cat.favorite = updateCatDto.favorite ?? cat.favorite;
      cat.name = updateCatDto.name ?? cat.name;
      cat.observations = updateCatDto.observations ?? cat.observations;
      cat.picture = updateCatDto.picture ?? cat.picture;
      cat.sex = updateCatDto.sex ?? cat.sex;
      cat.vaccines = updateCatDto.vaccines ?? cat.vaccines;
      cat.weight = updateCatDto.weight ?? cat.weight;

      const updatedCat = await this.catsRepository.update(cat);

      await this.appLogsService.create({
        action: 'update',
        resource: 'CATS',
        companyId,
        user: userId.toString(),
      });

      return updatedCat;
    } catch (error) {
      await this.appLogsService.create({
        action: 'update',
        resource: 'CATS',
        companyId,
        user: userId.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async changeFavorite(catId: number, companyId: number, userId: number) {
    try {
      const cat = await this.findById(catId, companyId);

      cat.favorite = !cat.favorite;

      const updatedCat = await this.catsRepository.update(cat);

      await this.appLogsService.create({
        action: 'changeFavorite',
        resource: 'CATS',
        companyId,
        user: userId.toString(),
      });

      return updatedCat;
    } catch (error) {
      await this.appLogsService.create({
        action: 'changeFavorite',
        resource: 'CATS',
        companyId,
        user: userId.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async softDelete(catId: number, companyId: number, userId: number) {
    try {
      await this.findById(catId, companyId);
      const softDeletedCat = await this.catsRepository.softDelete(catId);

      await this.appLogsService.create({
        action: 'softDelete',
        resource: 'CATS',
        companyId,
        user: userId.toString(),
      });

      return softDeletedCat;
    } catch (error) {
      await this.appLogsService.create({
        action: 'softDelete',
        resource: 'CATS',
        companyId,
        user: userId.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }
}
