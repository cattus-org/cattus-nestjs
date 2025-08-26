import { Injectable } from '@nestjs/common';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';
import { CamerasRepository } from './cameras.repository';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { AppLogsService } from '../app-logs/app-logs.service';

@Injectable()
export class CamerasService {
  constructor(
    private readonly camerasRepository: CamerasRepository,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
    private readonly appLogsService: AppLogsService,
  ) {}

  async create(createCameraDto: CreateCameraDto, userJwt: JwtPayload) {
    try {
      const user = await this.usersService.findOneById(userJwt.id);
      const company = await this.companiesService.findOneById(
        userJwt.company.id,
      );

      const newCamera = await this.camerasRepository.create(
        createCameraDto,
        company,
        user,
      );

      await this.appLogsService.create({
        action: 'create',
        resource: 'CAMERAS',
        companyId: userJwt.company.id,
        user: userJwt.id.toString(),
      });

      return newCamera;
    } catch (error) {
      await this.appLogsService.create({
        action: 'create',
        resource: 'CAMERAS',
        companyId: userJwt.company.id,
        user: userJwt.id.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async findAll(userJwt: JwtPayload) {
    try {
      const cameras = await this.camerasRepository.findAll(userJwt.company.id);

      await this.appLogsService.create({
        action: 'findAll',
        resource: 'CAMERAS',
        companyId: userJwt.company.id,
        user: userJwt.id.toString(),
      });

      return cameras;
    } catch (error) {
      await this.appLogsService.create({
        action: 'create',
        resource: 'CAMERAS',
        companyId: userJwt.company.id,
        user: userJwt.id.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async findOne(id: number, userJwt: JwtPayload) {
    try {
      const camera = await this.camerasRepository.findById(
        id,
        userJwt.company.id,
      );
      await this.appLogsService.create({
        action: 'findOne',
        resource: 'CAMERAS',
        companyId: userJwt.company.id,
        user: userJwt.id.toString(),
      });

      return camera;
    } catch (error) {
      await this.appLogsService.create({
        action: 'findOne',
        resource: 'CAMERAS',
        companyId: userJwt.company.id,
        user: userJwt.id.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async update(
    id: number,
    updateCameraDto: UpdateCameraDto,
    userJwt: JwtPayload,
  ) {
    try {
      const camera = await this.camerasRepository.findById(
        id,
        userJwt.company.id,
      );

      camera.name = updateCameraDto.name ?? camera.name;
      camera.thumbnail = updateCameraDto.thumbnail ?? camera.thumbnail;
      camera.deleted = updateCameraDto.deleted ?? camera.deleted;
      camera.url = updateCameraDto.url ?? camera.url;

      const updatedCamera = await this.camerasRepository.update(camera);

      await this.appLogsService.create({
        action: 'update',
        resource: 'CAMERAS',
        companyId: userJwt.company.id,
        user: userJwt.id.toString(),
      });

      return updatedCamera;
    } catch (error) {
      await this.appLogsService.create({
        action: 'update',
        resource: 'CAMERAS',
        companyId: userJwt.company.id,
        user: userJwt.id.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async softDelete(id: number, userJwt: JwtPayload) {
    try {
      const camera = await this.camerasRepository.findById(
        id,
        userJwt.company.id,
      );

      camera.deleted = true;
      camera.deletedAt = new Date();

      const updatedCamera = await this.camerasRepository.update(camera);

      await this.appLogsService.create({
        action: 'softDelete',
        resource: 'CAMERAS',
        companyId: userJwt.company.id,
        user: userJwt.id.toString(),
      });

      return updatedCamera;
    } catch (error) {
      await this.appLogsService.create({
        action: 'softDelete',
        resource: 'CAMERAS',
        companyId: userJwt.company.id,
        user: userJwt.id.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async remove(id: number, userJwt: JwtPayload) {
    try {
      const deletedCamera = await this.camerasRepository.remove(id);
      await this.appLogsService.create({
        action: 'remove',
        resource: 'CAMERAS',
        companyId: userJwt.company.id,
        user: userJwt.id.toString(),
      });

      return deletedCamera;
    } catch (error) {
      await this.appLogsService.create({
        action: 'remove',
        resource: 'CAMERAS',
        companyId: userJwt.company.id,
        user: userJwt.id.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }
}
