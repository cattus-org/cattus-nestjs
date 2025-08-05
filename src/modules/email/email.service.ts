import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_CATTUS,
      pass: process.env.PASSWORD_EMAIL_CATTUS,
    },
  });

  async sendMail(to: string, subject: string, html: string) {
    const from = `"Cattus 🐱" <${process.env.EMAIL_CATTUS}>`;

    await this.transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  }
}
