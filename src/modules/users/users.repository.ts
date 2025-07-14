import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    const createdUser = this.userRepository.create(user);
    const newUser = await this.userRepository.save(createdUser);

    delete newUser.password;

    return newUser;
  }

  async findAll(limit: number, offset: number, company: number) {
    const users = await this.userRepository.find({
      where: { company },
      take: limit,
      skip: offset,
      order: { id: 'desc' },
      select: [
        'id',
        'company',
        'email',
        'name',
        'createdAt',
        'updatedAt',
        'deleted',
      ],
    });
    return users;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: number, userData: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    user.email = userData?.email ?? user.email;
    user.password = userData.password ?? user.password;
    user.name = userData?.name ?? user.name;

    const updatedUser = await this.userRepository.save(user);
    delete updatedUser.password;

    return updatedUser;
  }

  async addCompany(companyId: number, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    user.company = companyId;

    const updatedUser = await this.userRepository.save(user);
    delete updatedUser.password;

    return updatedUser;
  }

  async softDelete(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    user.deleted = true;

    await this.userRepository.save(user);

    return user;
  }

  async hardDelete(id: number) {
    const user = await this.userRepository.delete({ id });
    return user;
  }
}
