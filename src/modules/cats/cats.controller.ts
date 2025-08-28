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
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { HasCompanyGuard } from 'src/common/guards/has-company.guard';
import { successResponse } from 'src/common/helpers/response.helper';

@UseGuards(HasCompanyGuard)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('jwt')
  @ApiForbiddenResponse({ description: 'user must belong to a company' })
  @UseInterceptors(
    FileInterceptor('picture', {
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
    @Body() createCatDto: CreateCatDto,
    @UploadedFile() picture: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ) {
    const cat = await this.catsService.create(
      createCatDto,
      picture,
      user.id,
      user.company.id,
    );

    return successResponse(cat, 'successfully created cat');
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: "returns a list of the company's cats" })
  @ApiForbiddenResponse({ description: 'user must belong to a company' })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query() paginationDTO: PaginationDTO,
  ) {
    const cats = await this.catsService.findAll(
      user.company.id,
      user.id,
      paginationDTO,
    );

    return successResponse(cats, 'cats successfully rescued');
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'returns a cat' })
  @ApiNotFoundResponse({ description: 'cat not found' })
  @ApiForbiddenResponse({ description: 'user must belong to a company' })
  async findOneById(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const cat = await this.catsService.findOneById(
      +id,
      user.company.id,
      user.id,
    );

    return successResponse(cat, 'cat successfully rescued');
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'returns the cat updated' })
  @ApiNotFoundResponse({ description: 'cat not found' })
  @ApiForbiddenResponse({ description: 'user must belong to a company' })
  async update(
    @Param('id') id: string,
    @Body() updateCatDto: UpdateCatDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const updatedCat = await this.catsService.update(
      +id,
      updateCatDto,
      user.company.id,
      user.id,
    );

    return successResponse(updatedCat, 'cat updated successfully');
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/change-favorite')
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'returns the cat with deleted: true' })
  @ApiNotFoundResponse({ description: 'cat not found' })
  @ApiForbiddenResponse({ description: 'user must belong to a company' })
  async changeFavorite(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const deletedCat = await this.catsService.changeFavorite(
      +id,
      user.company.id,
      user.id,
    );

    return successResponse(deletedCat, 'favorite updated successfully');
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/soft-delete')
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'returns the cat with deleted: true' })
  @ApiNotFoundResponse({ description: 'cat not found' })
  @ApiForbiddenResponse({ description: 'user must belong to a company' })
  async softDelete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const deletedCat = await this.catsService.softDelete(
      +id,
      user.company.id,
      user.id,
    );

    return successResponse(deletedCat, 'cat soft deleted successfully');
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'returns the cat with deleted: true' })
  @ApiNotFoundResponse({ description: 'cat not found' })
  @ApiForbiddenResponse({ description: 'user must belong to a company' })
  async delete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    await this.catsService.remove(+id, user.company.id, user.id);

    return successResponse(null, 'cat deleted successfully');
  }

  @HttpCode(HttpStatus.OK)
  @Get('report/:id')
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'returns a link for the report' })
  @ApiForbiddenResponse({ description: 'user must belong to a company' })
  async generateReport(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Query() paginationDTO: PaginationDTO,
  ) {
    const report = await this.catsService.generateReport(
      user,
      +id,
      paginationDTO,
    );
    return successResponse(report, 'report generated successfully');
  }
}

//TODO - criar job para apagar dados com deleted - colocar um 'deletedDate' nas entidades?
