import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CliHelperRepository } from './cli-helper.repository';

@Injectable()
export class CliHelperService {
  constructor(
    private readonly configService: ConfigService,
    private readonly cliHelperRepository: CliHelperRepository,
  ) {}

  /* Check if the password is valid */
  async checkValidation() {
    const validPasswords = [];
    const inValidPasswords = [];
    const passwords = await this.cliHelperRepository.getPasswords();

    this.log('Checking passwords...');
    const promises = passwords.map(async (p) => {
      const [status, message] =
        await this.cliHelperRepository.checkFromPasswordValidationApi(
          p.password,
        );
      if (status === 0) {
        this.log(p.password, message);
        inValidPasswords.push(p.password);
      } else {
        this.log(p.password, ['password is valid']);
        validPasswords.push(p.password);
      }
    });

    await Promise.all(promises);
    await this.cliHelperRepository.updatePassword(validPasswords, 1);
    await this.cliHelperRepository.updatePassword(inValidPasswords, 0);
  }

  /* Check if the password is valid */
  async checkCompromised() {
    const passwords = await this.cliHelperRepository.getPasswords();

    this.log('Checking passwords...');
    const promises = passwords.map(async (p) => {
      const [status, message] =
        await this.cliHelperRepository.checkFromPasswordCompromisedApi(
          p.password,
        );
      if (status === 0) {
        this.log(p.password, message);
      }
    });
    await Promise.all(promises);
  }

  /* Check if the password is valid */
  async checkValidationAndCompromised() {
    const validPasswords = [];
    const inValidPasswords = [];
    const passwords = await this.cliHelperRepository.getPasswords();

    this.log('Checking passwords...');
    const promises = passwords.map(async (p) => {
      const [statusValidation, messageValidation]: [number, string | string[]] =
        await this.cliHelperRepository.checkFromPasswordValidationApi(
          p.password,
        );

      const [statusCompromise, messageCompromise] =
        await this.cliHelperRepository.checkFromPasswordCompromisedApi(
          p.password,
        );

      if (statusValidation === 0 || statusCompromise === 0) {
        let message = [...messageValidation, messageCompromise];
        message = message.filter((error) => error !== '');
        this.log(p.password, message);
        inValidPasswords.push(p.password);
      } else {
        validPasswords.push(p.password);
      }
    });

    await Promise.all(promises);
    await this.cliHelperRepository.updatePassword(validPasswords, 1);
    await this.cliHelperRepository.updatePassword(inValidPasswords, 0);
  }

  log(...log: any) {
    if (this.configService.get('app.debug') === 'true') {
      if (this.configService.get('app.logType') === 'logger') {
        Logger.log(log, 'CliHelperService');
      } else {
        console.log(log);
      }
    }
  }
}
