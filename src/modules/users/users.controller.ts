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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
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
  @Post('create')
  @ApiCreatedResponse({ description: 'retorna o usuário criado' })
  @ApiBadRequestResponse({ description: 'email already used' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @ApiBearerAuth('jwt')
  @Roles('admin', 'owner')
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(
    @Query() paginationDTO: PaginationDTO,
    @CurrentUser() user: JwtPayload,
  ) {
    console.log(user);
    return this.usersService.findAll(user.company, paginationDTO);
  }

  @ApiBearerAuth('jwt') //apenas para testes
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
