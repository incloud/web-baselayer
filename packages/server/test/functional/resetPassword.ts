import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();

import { gql } from 'apollo-server-core';
import 'jest';
import { Container } from 'typedi';
import { MailerService, TestMailer } from '../../src/service/MailerService';
import { Helper } from '../helper';

describe('resetPassword', () => {
  const helper = new Helper();
  const resetPasswordMutation = gql`
    mutation ResetPassword($email: String!) {
      resetPassword(email: $email)
    }
  `;

  beforeAll(async () => {
    await helper.init({
      updateContainer: container => {
        container.set(MailerService, new TestMailer());
      },
    });
  });

  afterAll(async () => {
    await helper.shutdown();
  });

  it('resetPassword should send no email if user is not existing', async () => {
    const result = await helper.mutate(resetPasswordMutation, {
      email: 'notExisting@incloud.de',
    });

    expect(result.data!.resetPassword!).toBeDefined();
    expect(result.data!.resetPassword!).toBeTruthy();

    const mailerService = Container.get(MailerService) as TestMailer;
    expect(mailerService.sentMails).toHaveLength(0);
  });

  it('resetPassword should send a mail if user is existing', async () => {
    const result = await helper.mutate(resetPasswordMutation, {
      email: 'dev@incloud.de',
    });

    expect(result.data!.resetPassword!).toBeDefined();
    expect(result.data!.resetPassword!).toBeTruthy();

    const mailerService = Container.get(MailerService) as TestMailer;
    expect(mailerService.sentMails).toHaveLength(1);
  });
});
