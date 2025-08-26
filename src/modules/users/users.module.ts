import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AppLogsModule } from '../app-logs/app-logs.module';
import { CompaniesModule } from '../companies/companies.module';
import { PasswordResetRepository } from '../auth/password-reset.repository';
import { PasswordResetToken } from '../auth/entities/password-reset.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordResetToken]),
    AppLogsModule,
    EmailModule,
    forwardRef(() => CompaniesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PasswordResetRepository],
  exports: [UsersService, UsersRepository], //exportando o usersRepository para conseguir utilizar em companies (tinha quebrado por conta do ciclo de deps)
})
export class UsersModule {}
