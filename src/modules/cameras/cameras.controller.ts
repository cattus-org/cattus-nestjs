import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CamerasService } from './cameras.service';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { successResponse } from 'src/common/helpers/response.helper';

@Controller('cameras')
export class CamerasController {
  constructor(private readonly camerasService: CamerasService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'camera created successfully' })
  @ApiForbiddenResponse({ description: 'user must belong to a company' })
  async create(
    @Body() createCameraDto: CreateCameraDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const camera = await this.camerasService.create(createCameraDto, user);
    return successResponse(camera, 'camera created successfully');
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'cameras successfully retrieved' })
  @ApiForbiddenResponse({ description: 'user must belong to a company' })
  async findAll(@CurrentUser() user: JwtPayload) {
    const cameras = await this.camerasService.findAll(user);
    return successResponse(cameras, 'cameras successfuly retrieved');
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'camera successfully retrieved' })
  @ApiNotFoundResponse({ description: 'camera not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const camera = await this.camerasService.findOne(+id, user);
    return successResponse(camera, 'camera successfully retrieved');
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'camera updated successfully' })
  @ApiNotFoundResponse({ description: 'camera not found' })
  @ApiForbiddenResponse({ description: 'user must belong to a company' })
  async update(
    @Param('id') id: string,
    @Body() updateCameraDto: UpdateCameraDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const camera = await this.camerasService.update(+id, updateCameraDto, user);
    return successResponse(camera, 'camera updated successfully');
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiBearerAuth('jwt')
  @ApiResponse({ description: 'camera deleted successfully' })
  @ApiNotFoundResponse({ description: 'camera not found' })
  @ApiForbiddenResponse({ description: 'user must belong to a company' })
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const removedCamera = await this.camerasService.remove(+id, user);
    return successResponse(removedCamera, 'camera deleted successfully');
  }
}
