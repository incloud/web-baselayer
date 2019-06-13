import { IMailer, IMailOptions } from '.';

export class TestMailer implements IMailer {
  public readonly sentMails: {
    mailOptions: IMailOptions;
    receiver: string;
    sentAt: Date;
  }[] = [];

  async sendEmail(receiver: string, mailOptions: IMailOptions): Promise<void> {
    this.sentMails.push({
      mailOptions,
      receiver,
      sentAt: new Date(),
    });
  }
}
