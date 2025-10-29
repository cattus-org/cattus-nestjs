import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { successResponse } from 'src/common/helpers/response.helper';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'returns token' })
  @ApiUnauthorizedResponse({ description: 'invalid credentials' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @Public()
  @Post()
  async signIn(@Body() loginDto: LoginDto) {
    const { token } = await this.authService.signIn(loginDto);
    return successResponse({ token }, 'sign in successfully');
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('jwt')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({ description: '{ valid: true, user: tokenData }' })
  @Get('verify')
  check(@CurrentUser() user: JwtPayload) {
    return successResponse({ user }, 'valid token');
  }
}
