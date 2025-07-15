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
    return await this.usersService.create(createUserDto);
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
    return await this.usersService.findAll(user.company.id, paginationDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiBearerAuth('jwt')
  @ApiNotFoundResponse({ description: 'user not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.usersService.findOneByIdWithValidation(+id, user);
  }

  @HttpCode(HttpStatus.OK) //alterar isso?
  @Patch(':id')
  @ApiBearerAuth('jwt')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.usersService.update(+id, updateUserDto, user);
  }

  @HttpCode(HttpStatus.OK) //o correto aqui e no update seria o no_content né, mas fazer o que, quero enxergar o que to fazendo
  @Delete(':id')
  @ApiBearerAuth('jwt')
  async softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return await this.usersService.softDelete(+id, user);
  }

  //TODO - criar rota pra reativar o user
}
