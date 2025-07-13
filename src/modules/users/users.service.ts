import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { hash } from 'bcrypt';

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
      throw new HttpException(
        `fail to create new user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(company: number, paginationDTO?: PaginationDTO) {
    //TODO - adicionar validação de nivel de acesso, talvez nos controllers?
    const { limit = 10, offset = 0 } = paginationDTO;
    const users = await this.repository.findAll(limit, offset, company);
    if (users.length === 0) {
      throw new NotFoundException('users not found');
    }

    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    const findedUser = await this.repository.findByEmail(email);
    if (!findedUser) {
      throw new NotFoundException('User not found');
    }

    return findedUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
