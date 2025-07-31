import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('logotype', {
      fileFilter: (req, file, cb) => {
        const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(
          file.mimetype,
        );
        if (!isImage)
          return cb(new BadRequestException('only images are allowed'), false);
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.companiesService.create(createCompanyDto, file, user.id);
  }

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  async findOneByCNPJ(@Param('id') cnpj: string) {
    return await this.companiesService.findOneByCNPJ(cnpj);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }
}
