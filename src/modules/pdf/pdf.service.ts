import { Injectable } from '@nestjs/common';
import { ActivitiesService } from '../activities/activities.service';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interfaces';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Cat } from '../cats/entities/cat.entity';
import { S3Service } from '../aws/s3/s3.service';
import { AppLogsService } from '../app-logs/app-logs.service';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Injectable()
export class PdfService {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly s3Service: S3Service,
    private readonly appLogsService: AppLogsService,
  ) {}

  async generateCatActivitiesReport(
    catId: number,
    user: JwtPayload,
    cat: Cat,
    paginationDTO: PaginationDTO,
  ) {
    try {
      const activities = await this.activitiesService.findAllByCat(
        catId,
        user,
        paginationDTO,
      );

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let page = pdfDoc.addPage([800, 1000]);
      let y = 950;

      // Cabeçalho
      page.drawText('Relatório de atividades', {
        x: 50,
        y,
        size: 20,
        font: boldFont,
        color: rgb(0, 0, 0.8),
      });
      y -= 30;

      page.drawText(cat.name, { x: 50, y, size: 16, font: boldFont });
      y -= 20;

      //dados
      page.drawText(
        `Nascimento: ${cat.birthDate?.toISOString().split('T')[0] || 'N/A'}`,
        { x: 50, y, size: 12, font },
      );
      page.drawText(`Vacinação: ${cat.vaccines ? 'Sim' : 'Não'}`, {
        x: 300,
        y,
        size: 12,
        font,
      });
      y -= 20;

      page.drawText(`Comorbidades: ${cat.comorbidities || '-'}`, {
        x: 50,
        y,
        size: 12,
        font,
      });
      y -= 20;

      page.drawText(`Observações: ${cat.observations || '-'}`, {
        x: 50,
        y,
        size: 12,
        font,
      });
      y -= 40;

      //status
      page.drawRectangle({
        x: 50,
        y: y - 60,
        width: 700,
        height: 60,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
      page.drawText(`Estado atual: ${cat.status || '-'}`, {
        x: 60,
        y: y - 20,
        size: 12,
        font,
      });

      y -= 80;

      //activities
      page.drawText('Atividades na última semana:', {
        x: 50,
        y,
        size: 14,
        font: boldFont,
      });
      y -= 20;

      //table header
      page.drawRectangle({
        x: 50,
        y: y - 20,
        width: 700,
        height: 20,
        color: rgb(0.9, 0.9, 0.9),
      });
      page.drawText('Atividade', {
        x: 60,
        y: y - 15,
        size: 12,
        font: boldFont,
      });
      page.drawText('Início', { x: 260, y: y - 15, size: 12, font: boldFont });
      page.drawText('Fim', { x: 500, y: y - 15, size: 12, font: boldFont });
      y -= 40;

      //tablee
      for (const activity of activities) {
        if (y < 100) {
          page = pdfDoc.addPage([800, 1000]);
          y = 950;
        }

        page.drawRectangle({
          x: 50,
          y: y - 20,
          width: 700,
          height: 20,
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 0.5,
        });
        page.drawText(activity.title, { x: 60, y: y - 15, size: 11, font });
        page.drawText(activity.startedAt.toLocaleString(), {
          x: 260,
          y: y - 15,
          size: 11,
          font,
        });
        page.drawText(
          activity.endedAt ? activity.endedAt.toLocaleString() : '-',
          {
            x: 500,
            y: y - 15,
            size: 11,
            font,
          },
        );

        y -= 25;
      }

      // --- RODAPÉ ---
      const pages = pdfDoc.getPages();
      pages.forEach((p, idx) => {
        p.drawText('Animais em Apuros Resgate e Reabilitação Ltda', {
          x: 50,
          y: 40,
          size: 10,
          font,
        });
        p.drawText('12.345.678/0001-90   11 98765-4321', {
          x: 50,
          y: 25,
          size: 10,
          font,
        });
        p.drawText(`Página ${idx + 1} de ${pages.length}`, {
          x: 700,
          y: 25,
          size: 10,
          font,
        });
        p.drawText(`Relatório gerado em ${new Date().toLocaleString()}`, {
          x: 500,
          y: 40,
          size: 10,
          font,
        });
      });

      const pdfBytes = await pdfDoc.save();
      const buffer = Buffer.from(pdfBytes);

      const fileKey = `reports/cat-${cat.id}-${Date.now()}.pdf`;

      await this.appLogsService.create({
        action: 'generateCatActivitiesReport',
        resource: 'PDF',
        companyId: user.company.id,
        user: user.id.toString(),
      });

      return await this.s3Service.uploadBuffer(buffer, fileKey);
    } catch (error) {
      await this.appLogsService.create({
        action: 'generateCatActivitiesReport',
        resource: 'PDF',
        companyId: user.company.id,
        user: user.id.toString(),
        details: `FAIL: ${error.message}`,
      });

      throw error;
    }
  }
}
