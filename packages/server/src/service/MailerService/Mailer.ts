import { createTransport, Transporter } from 'nodemailer';
import { Service } from 'typedi';
import { IMailer, IMailOptions, MailerService } from '.';

@Service(MailerService)
export class Mailer implements IMailer {
  private readonly transport: Transporter;

  constructor() {
    this.transport = createTransport({
      auth: {
        pass: process.env.MAILER_PASSWORD!,
        user: process.env.MAILER_USER!,
      },
      host: process.env.MAILER_HOST!,
      port: parseInt(process.env.MAILER_PORT!, 10),
    });
  }

  async sendEmail(receiver: string, mailOptions: IMailOptions): Promise<void> {
    return this.transport.sendMail({
      from: process.env.MAILER_FROM!,
      to: receiver,
      ...mailOptions,
    });
  }
}
