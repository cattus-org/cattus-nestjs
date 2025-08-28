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
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';
import { successResponse } from 'src/common/helpers/response.helper';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CattusAdmin } from 'src/common/constants/user.constants';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ description: 'returns a new company' })
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
    const company = await this.companiesService.create(
      createCompanyDto,
      file,
      user.id,
    );

    return successResponse(company, 'company successfully created');
  }

  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @Get()
  @Roles(CattusAdmin)
  async findAll(@Query() paginationDto: PaginationDTO) {
    return await this.companiesService.findAll(paginationDto);
  }

  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @Roles(CattusAdmin)
  async findOneByCNPJ(@Param('id') cnpj: string) {
    return await this.companiesService.findOneByCNPJ(cnpj);
  }

  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: 'returns an updated company' })
  @ApiForbiddenResponse({ description: 'access denied' })
  @ApiNotFoundResponse({ description: 'company not found' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return await this.companiesService.update(+id, user, updateCompanyDto);
  }

  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: 'returns a soft deleted company' })
  @ApiForbiddenResponse({ description: 'access denied' })
  @ApiNotFoundResponse({ description: 'company not found' })
  @Delete(':id')
  async softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return await this.companiesService.softDelete(+id, user);
  }
}

//TODO - arrumar forbidden / unauthorized - ver qual o correto pra cada caso
