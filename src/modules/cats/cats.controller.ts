import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('jwt')
  @UseInterceptors(FileInterceptor('picture'))
  async create(
    @Body() createCatDto: CreateCatDto,
    @UploadedFile() picture: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.catsService.create(
      createCatDto,
      picture,
      user.id,
      user.company.id,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'retorna uma lista com os gatos da company' })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query() paginationDTO: PaginationDTO,
  ) {
    return await this.catsService.findAll(
      user.company.id,
      user.id,
      paginationDTO,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'retorna o gato referente ao id' })
  @ApiNotFoundResponse({ description: 'cat not found' })
  async findOneById(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return await this.catsService.findOneById(+id, user.company.id, user.id);
  }

  //no final do projeto mudar para as respostas corretas
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'retorna o gato atualizado' })
  @ApiNotFoundResponse({ description: 'cat not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCatDto: UpdateCatDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.catsService.update(
      +id,
      updateCatDto,
      user.company.id,
      user.id,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'retorna o gato com deleted: true' })
  @ApiNotFoundResponse({ description: 'cat not found' })
  async softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.catsService.softDelete(+id, user.company.id, user.id);
  }
}
