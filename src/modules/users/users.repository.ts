import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    const createdUser = this.userRepository.create(user);
    return await this.userRepository.save(createdUser);
  }

  async findAll(
    limit: number,
    offset: number,
    deleted: boolean,
    company: number,
  ) {
    return await this.userRepository.find({
      where: { company: { id: company }, deleted },
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
  }

  async findOneById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['company'],
    });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['company'],
    });
  }

  async update(user: User) {
    return await this.userRepository.save(user);
  }

  async softDelete(id: number, deletedAt: Date = new Date()) {
    const user = await this.userRepository.findOneBy({ id });

    user.deletedAt = deletedAt;
    user.deleted = true;

    return await this.userRepository.save(user);
  }

  async hardDelete(id: number) {
    const user = await this.userRepository.delete({ id });
    return user;
  }
}
