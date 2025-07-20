import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class CatsRepository {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
  ) {}

  async create(
    cat: CreateCatDto,
    picture: string,
    user: User,
    company: Company,
  ) {
    const newCat = this.catRepository.create({
      ...cat,
      picture,
      createdBy: user,
      company: company,
    });

    return await this.catRepository.save(newCat);
  }

  async findAllByCompany(
    limit: number,
    offset: number,
    deleted: boolean,
    companyId: number,
  ) {
    return await this.catRepository.find({
      where: { company: { id: companyId }, deleted },
      take: limit,
      skip: offset,
    });
  }

  async findById(catId: number, companyId: number) {
    return await this.catRepository.findOne({
      where: { id: catId, company: { id: companyId } },
    });
  }

  async update(cat: Cat) {
    return await this.catRepository.save(cat);
  }

  async softDelete(catId: number) {
    const findedCat = await this.catRepository.findOne({
      where: { id: catId },
    });

    findedCat.deleted = true;

    return await this.catRepository.save(findedCat);
  }

  async hardDelete(catId: number) {
    return await this.catRepository.delete({ id: catId });
  }
}
