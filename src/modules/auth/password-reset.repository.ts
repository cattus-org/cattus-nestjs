import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetToken } from './entities/password-reset.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PasswordResetRepository {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetRepository: Repository<PasswordResetToken>,
  ) {}

  async create(token: string, user: User, expiresAt: Date) {
    const newToken = this.passwordResetRepository.create({
      token,
      user,
      expiresAt,
    });

    return await this.passwordResetRepository.save(newToken);
  }

  async findOneByToken(token: string) {
    return await this.passwordResetRepository.findOne({
      where: { token },
      relations: ['user'],
    });
  }

  async remove(id: number) {
    return await this.passwordResetRepository.delete(id);
  }
}
