import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AppLogsService } from '../app-logs/app-logs.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly appLogsService: AppLogsService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );
    const isMatch = await compare(loginDto.password, user.password);

    if (!isMatch) {
      await this.appLogsService.create({
        user: loginDto.email,
        action: 'signIn',
        resource: 'AUTH',
        details: 'FAIL: invalid credentials',
      });

      throw new UnauthorizedException('invalid credentials');
    }

    await this.appLogsService.create({
      user: user.id,
      companyId: user.company.id,
      action: 'signIn',
      resource: 'AUTH',
    });

    const payload = {
      id: user.id,
      name: user.name,
      company: user.company,
      email: user.email,
      access_level: user.access_level,
    };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
