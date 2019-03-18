import { IProcessor } from 'typeorm-fixtures-cli';
import { User } from '../entity/User';
import { Gender } from '../enum/Gender';
import { hashPassword } from '../util/hashing';

export default class UserProcessor implements IProcessor<User> {
  // tslint:disable-next-line:variable-name
  async preProcess(_name: string, object: any): Promise<any> {
    const { passwordPlain, email, ...userProperties } = object;

    const gender = Gender.Female;
    const lowerCaseEmail = email.toLowerCase();
    const password = await hashPassword(passwordPlain);
    return { ...userProperties, gender, password, email: lowerCaseEmail };
  }
}
