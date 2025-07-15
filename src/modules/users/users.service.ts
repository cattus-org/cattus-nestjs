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

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await hash(createUserDto.password, 10);
      const newUser = await this.repository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return newUser;
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException('email already used');
      }
      //TODO - adicionar um log de erro
      throw error;
    }
  }

  async findAll(company: number, paginationDTO?: PaginationDTO) {
    //TODO - adicionar validação de nivel de acesso, talvez nos controllers? - ta lá já
    const { limit = 10, offset = 0, deleted = false } = paginationDTO;
    const users = await this.repository.findAll(
      limit,
      offset,
      deleted,
      company,
    );
    if (users.length === 0) {
      throw new NotFoundException('users not found');
    }

    return users;
  }

  async findOneById(id: number) {
    const findedUser = await this.repository.findOneById(id);
    if (!findedUser) throw new NotFoundException('user not found');

    return findedUser;
  }

  async findOneByIdWithValidation(id: number, user: JwtPayload) {
    hasRoleOrSelf({ id: user.id, access_level: user.access_level }, id);

    const findedUser = await this.repository.findOneById(id);
    if (!findedUser) throw new NotFoundException('user not found');

    return findedUser;
  }

  async findByEmailWithPassword(email: string) {
    const findedUser = await this.repository.findByEmail(email);
    if (!findedUser) throw new NotFoundException('user not found');

    return findedUser;
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

      return updatedUser;
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException('email already used');
      }
      //TODO - adicionar um log de erro
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

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async softDelete(id: number, user: JwtPayload) {
    try {
      hasRoleOrSelf({ id: user.id, access_level: user.access_level }, id);
      await this.findOneById(id);
      const deletedUser = await this.repository.softDelete(id);

      return deletedUser;
    } catch (error) {
      throw error;
    }
  }
}
