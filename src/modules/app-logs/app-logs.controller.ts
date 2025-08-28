import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AppLogsService } from './app-logs.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { successResponse } from 'src/common/helpers/response.helper';

@Controller('app-logs')
export class AppLogsController {
  constructor(private readonly appLogsService: AppLogsService) {}

  //TODO - adicionar HttpCode em todas as rotas de todos os módulos - colocar os corretos, não OK em tudo
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'returns a system logs list' })
  @ApiForbiddenResponse({ description: 'access denied' })
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
