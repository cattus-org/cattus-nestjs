import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AppLogsService } from './app-logs.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { successResponse } from 'src/common/helpers/response.helper';

@Controller('app-logs')
export class AppLogsController {
  constructor(private readonly appLogsService: AppLogsService) {}

  //TODO - adicionar HttpCode em todas as rotas de todos os módulos
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'retorna uma lista com os logs do sistema' })
  @ApiUnauthorizedResponse({ description: 'access denied' })
  @Roles('admin', 'owner')
  async findAll(
    @Query() paginationDTO: PaginationDTO,
    @CurrentUser() user: JwtPayload,
  ) {
    const logs = await this.appLogsService.findAll(
      user.company.id,
      paginationDTO,
    );

    return successResponse(logs, 'logs successfully rescued');
  }
}
