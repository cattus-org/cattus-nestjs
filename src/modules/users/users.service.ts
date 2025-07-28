import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { hash } from 'bcrypt';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';
import { hasRoleOrSelf } from 'src/common/helpers/access-level.helper';
import { Company } from '../companies/entities/company.entity';
import { AppLogsService } from '../app-logs/app-logs.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly appLogsService: AppLogsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await hash(createUserDto.password, 10);
      const newUser = await this.repository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      await this.appLogsService.create({ action: 'create', resource: 'USERS' });

      delete newUser.password;

      return newUser;
    } catch (error) {
      await this.appLogsService.create({
        action: 'create',
        resource: 'USERS',
        details: `FAIL: ${error.message}`,
      });
      if (error.code == 23505) {
        throw new ConflictException('email already used');
      }
      throw error;
    }
  }

  async findAll(
    company: number,
    userId: number,
    paginationDTO?: PaginationDTO,
  ) {
    const { limit = 10, offset = 0, deleted = false } = paginationDTO;
    const users = await this.repository.findAll(
      limit,
      offset,
      deleted,
      company,
    );

    await this.appLogsService.create({
      action: 'findAll',
      resource: 'USERS',
      user: userId.toString(),
      companyId: company,
    });

    return users;
  }

  async findOneById(id: number) {
    try {
      const findedUser = await this.repository.findOneById(id);
      if (!findedUser) throw new NotFoundException('user not found');

      await this.appLogsService.create({
        action: 'findOneById',
        resource: 'USERS',
      });

      return findedUser;
    } catch (error) {
      await this.appLogsService.create({
        action: 'findOneById',
        resource: 'USERS',
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async findOneByIdWithValidation(id: number, user: JwtPayload) {
    try {
      hasRoleOrSelf({ id: user.id, access_level: user.access_level }, id);

      const findedUser = await this.repository.findOneById(id);
      if (!findedUser) throw new NotFoundException('user not found');

      await this.appLogsService.create({
        action: 'findOneByIdWithValidation',
        resource: 'USERS',
        companyId: user.company.id,
        user: user.id.toString(),
      });

      return findedUser;
    } catch (error) {
      await this.appLogsService.create({
        action: 'findOneByIdWithValidation',
        resource: 'USERS',
        user: user.id.toString(),
        companyId: user.company.id,
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async findByEmailWithPassword(email: string) {
    try {
      const findedUser = await this.repository.findByEmail(email);
      if (!findedUser) throw new NotFoundException('user not found');

      await this.appLogsService.create({
        action: 'findByEmailWithPassword',
        resource: 'USERS',
        user: email,
        companyId: findedUser.company?.id,
      });

      return findedUser;
    } catch (error) {
      await this.appLogsService.create({
        action: 'findByEmailWithPassword',
        resource: 'USERS',
        user: email,
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, user: JwtPayload) {
    try {
      hasRoleOrSelf({ id: user.id, access_level: user.access_level }, id);

      const findedUser = await this.findOneById(id);

      if (updateUserDto.password) {
        findedUser.password = await hash(updateUserDto.password, 10);
      }

      findedUser.email = updateUserDto.email ?? findedUser.email;
      findedUser.name = updateUserDto.name ?? findedUser.name;

      const updatedUser = await this.repository.update(findedUser);
      delete updatedUser.password;

      await this.appLogsService.create({
        action: 'update',
        resource: 'USERS',
        user: user.id.toString(),
        companyId: user.company.id,
      });

      return updatedUser;
    } catch (error) {
      await this.appLogsService.create({
        action: 'update',
        resource: 'USERS',
        user: user.id.toString(),
        companyId: user.company.id,
        details: `FAIL: ${error.message}`,
      });

      if (error.code == 23505) {
        throw new ConflictException('email already used');
      }

      throw error;
    }
  }

  async addCompanyAndAccessLevel(company: Company, userId: number) {
    try {
      const user = await this.findOneById(userId);
      user.company = company;
      user.access_level = 'admin';

      const updatedUser = await this.repository.update(user);
      delete updatedUser.password;

      await this.appLogsService.create({
        action: 'addCompanyAndAccessLevel',
        resource: 'USERS',
        user: user.id.toString(),
        companyId: user.company.id,
      });

      return updatedUser;
    } catch (error) {
      await this.appLogsService.create({
        action: 'addCompanyAndAccessLevel',
        resource: 'USERS',
        user: userId.toString(),
        companyId: company.id,
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }

  async softDelete(id: number, user: JwtPayload) {
    try {
      hasRoleOrSelf({ id: user.id, access_level: user.access_level }, id);
      await this.findOneById(id);
      const deletedUser = await this.repository.softDelete(id);

      await this.appLogsService.create({
        action: 'softDelete',
        resource: 'USERS',
        user: user.id.toString(),
        companyId: user.company.id,
      });

      return deletedUser;
    } catch (error) {
      await this.appLogsService.create({
        action: 'softDelete',
        resource: 'USERS',
        user: user.id.toString(),
        companyId: user.company.id,
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }
}

//TODO - adicionar service para adicionar user a determinada company
//TODO - adicionar recuperação de senha
//TODO - adicionar validação pra empresa manter pelo menos 1 usuário
//TODO - adicionar validação pra logar - deleted: false
