import { Token } from 'typedi';

export interface IMailer {
  sendEmail(receiver: string, mailOptions: IMailOptions): Promise<void>;
}

export interface IMailOptions {
  subject: string;
  text: string;
  html?: string;
}

export const MailerService: Token<IMailer> = new Token<IMailer>();

export { Mailer } from './Mailer';
export { TestMailer } from './TestMailer';
