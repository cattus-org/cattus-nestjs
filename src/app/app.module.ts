import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/modules/users/users.module';
import { CatsModule } from 'src/modules/cats/cats.module';
import { CompaniesModule } from 'src/modules/companies/companies.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { S3Module } from 'src/modules/aws/s3/s3.module';
import { ActivitiesModule } from 'src/modules/activities/activities.module';
import { PdfModule } from 'src/modules/pdf/pdf.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      // port: 5432,
      url: process.env.DB_URL,
      // database: process.env.DATABASE,
      // username: process.env.DB_USERNAME,
      // password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, //desativar em prod
    }),
    CatsModule,
    CompaniesModule,
    UsersModule,
    AuthModule,
    S3Module,
    ActivitiesModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
