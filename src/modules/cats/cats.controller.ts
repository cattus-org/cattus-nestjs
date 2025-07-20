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
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';

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

  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catsService.remove(+id);
  }
}
