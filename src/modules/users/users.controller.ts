import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';
import { Roles } from 'src/common/decorators/roles.decorator';
import { successResponse } from 'src/common/helpers/response.helper';
import { ForgotPasswordDto } from '../auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '../auth/dto/reset-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //adicionar os status code corretos
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiCreatedResponse({ description: 'retorna o usuário criado' })
  @ApiConflictResponse({ description: 'email already used' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return successResponse(user, 'user successfully created');
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'retorna uma lista com os usuários da empresa' })
  @ApiUnauthorizedResponse({ description: 'access denied' })
  @Roles('admin', 'owner')
  async findAll(
    @Query() paginationDTO: PaginationDTO,
    @CurrentUser() user: JwtPayload,
  ) {
    const users = await this.usersService.findAll(
      user.company.id,
      user.id,
      paginationDTO,
    );

    return successResponse(users, 'users successfully rescued');
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiBearerAuth('jwt')
  @ApiNotFoundResponse({ description: 'user not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const userData = await this.usersService.findOneByIdWithValidation(
      +id,
      user,
    );

    return successResponse(userData, 'user successfully rescued');
  }

  @HttpCode(HttpStatus.OK) //alterar isso?
  @Patch(':id')
  @ApiBearerAuth('jwt')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const updatedUser = await this.usersService.update(
      +id,
      updateUserDto,
      user,
    );

    return successResponse(updatedUser, 'user successfully updated');
  }

  @HttpCode(HttpStatus.OK) //o correto aqui e no update seria o no_content né, mas fazer o que, quero enxergar o que to fazendo
  @Delete(':id')
  @ApiBearerAuth('jwt')
  async softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const deletedUser = await this.usersService.softDelete(+id, user);

    return successResponse(deletedUser, 'user successfully deleted');
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  @ApiResponse({
    description: 'returns: If your email exists, a reset link has been sent',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.usersService.sendPasswordReset(forgotPasswordDto.email);

    return successResponse(
      null,
      'If your email exists, a reset link has been sent',
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiResponse({ description: 'returns: password updated successfully' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.usersService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );

    return successResponse(null, 'password updated successfully');
  }

  //TODO - criar rota pra reativar o user
}
