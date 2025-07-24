import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AppLogsService } from 'src/modules/app-logs/app-logs.service';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;

  constructor(private readonly appLogsService: AppLogsService) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder = 'companies') {
    try {
      if (!file) throw new BadRequestException('file not found');
      const fileKey = `${folder}/${randomUUID()}-${file.originalname.replace(/\s/g, '')}`;

      const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3.send(command);

      await this.appLogsService.create({
        action: 'uploadFile',
        resource: 'S3',
      });

      return `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    } catch (error) {
      await this.appLogsService.create({
        action: 'uploadFile',
        resource: 'S3',
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }
}
