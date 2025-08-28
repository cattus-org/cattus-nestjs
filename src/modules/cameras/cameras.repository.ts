import { InjectRepository } from '@nestjs/typeorm';
import { Camera } from './entities/camera.entity';
import { Repository } from 'typeorm';
import { CreateCameraDto } from './dto/create-camera.dto';
import { Company } from '../companies/entities/company.entity';
import { User } from '../users/entities/user.entity';

export class CamerasRepository {
  constructor(
    @InjectRepository(Camera)
    private readonly camerasRepository: Repository<Camera>,
  ) {}

  async create(createCameraDto: CreateCameraDto, company: Company, user: User) {
    const camera = this.camerasRepository.create({
      ...createCameraDto,
      company,
      createdBy: user,
    });
    return await this.camerasRepository.save(camera);
  }

  async findById(id: number, companyId: number) {
    return await this.camerasRepository.findOne({
      where: { id, company: { id: companyId } },
    });
  }

  async findAll(
    companyId: number,
    limit: number,
    offset: number,
    deleted: boolean,
  ) {
    return await this.camerasRepository.find({
      where: { company: { id: companyId }, deleted },
      take: limit,
      skip: offset,
    });
  }

  async update(camera: Camera) {
    return await this.camerasRepository.save(camera);
  }

  async remove(id: number) {
    return await this.camerasRepository.delete({ id });
  }
}
