import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'retorna token' })
  @ApiUnauthorizedResponse({ description: 'invalid credentials' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @Public()
  @Post()
  async signIn(@Body() loginDto: LoginDto) {
    return await this.authService.signIn(loginDto);
  }
}
