import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
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
  @ApiBearerAuth('jwt')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return await this.s3Service.uploadFile(file, 'cats-images');
  }
}
