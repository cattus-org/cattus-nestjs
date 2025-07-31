import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { successResponse } from 'src/common/helpers/response.helper';

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
    const { token } = await this.authService.signIn(loginDto);
    return successResponse({ token }, 'sign in successfully');
  }
}
