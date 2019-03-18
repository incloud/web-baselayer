import { Arg, Mutation, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../../../repository/UserRepository';
import { IMailer, MailerService } from '../../../service/MailerService';
import { PasswordResetService } from '../../../service/PasswordResetService';
import { createLink } from '../../../util/createLink';

@Service()
@Resolver()
export class ResetPasswordResolver {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  @Inject(MailerService)
  private readonly mailerService: IMailer;

  @Inject()
  private readonly passwordResetService: PasswordResetService;

  /**
   * Creates a new random password for the user
   */
  @Mutation(() => Boolean)
  async resetPassword(
    @Arg('email') email: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);

    // Just act as if we send the email => don't expose who is registered apart from registration itself
    if (!user) {
      return true;
    }

    const token = await this.passwordResetService.requestPasswordReset(user);
    // Enter valid path for resetting password page here
    const resetUrl = createLink('/not-a-valid-path', {
      token,
    });

    const text = `
Forgot your password?

You can reset your password by visiting the link below.

${resetUrl}

If you did not request this mail ignore it.

--

ACME Incorporated, 123 ACME Drive, Nice Beach, CA 23452
    `;

    await this.mailerService.sendEmail(user.email, {
      subject: 'Reset your password',
      text,
    });

    return true;
  }
}
