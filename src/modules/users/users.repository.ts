import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    const createdUser = this.userRepository.create(user);
    return await this.userRepository.save(createdUser);
  }

  //adicionar paginação, limite
  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async update(id: number, userData: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    user.email = userData?.email ?? user.email;
    user.password = userData.password ?? user.password;
    user.name = userData?.name ?? user.name;

    await this.userRepository.save(user);

    return user;
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
