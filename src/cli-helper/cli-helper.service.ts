import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';
import { Password } from './password.entity';

@Injectable()
export class CliHelperService {
  constructor(
    @InjectRepository(Password)
    private readonly passwordsRepository: Repository<Password>,
    private readonly configService: ConfigService,
  ) {}

  /* Get all passwords from the database */
  async getPasswords(): Promise<Password[]> {
    return this.passwordsRepository.find();
  }

  /* Check if the password is valid */
  async checkValidation() {
    const validPasswords = [];
    const inValidPasswords = [];
    const passwords = await this.getPasswords();

    this.log('Checking passwords...');
    const promises = passwords.map(async (p) => {
      const [status, message] = await this.checkFromPasswordValidationApi(
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
    await this.updatePassword(validPasswords, 1);
    await this.updatePassword(inValidPasswords, 0);
  }

  /* Update password status */
  async updatePassword(passwords, valid) {
    await getConnection()
      .createQueryBuilder()
      .update(Password)
      .set({ valid })
      .where({ password: In(passwords) })
      .execute();
  }

  /* Check if the password is valid */
  async checkCompromised() {
    const passwords = await this.getPasswords();

    this.log('Checking passwords...');
    const promises = passwords.map(async (p) => {
      const [status, message] = await this.checkFromPasswordCompromisedApi(
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
    const passwords = await this.getPasswords();

    this.log('Checking passwords...');
    const promises = passwords.map(async (p) => {
      const [statusValidation, messageValidation] =
        await this.checkFromPasswordValidationApi(p.password);

      const [statusCompromise, messageCompromise] =
        await this.checkFromPasswordCompromisedApi(p.password);

      if (statusValidation === 0 || statusCompromise === 0) {
        let message = [...messageValidation, messageCompromise];
        message = message.filter(function (e) {
          return e !== '';
        });
        this.log(p.password, message);
        inValidPasswords.push(p.password);
      } else {
        validPasswords.push(p.password);
      }
    });

    await Promise.all(promises);
    await this.updatePassword(validPasswords, 1);
    await this.updatePassword(inValidPasswords, 0);
  }

  /* Get password validation status from the password validation api */
  async checkFromPasswordValidationApi(password: string) {
    const url = this.configService.get('api.validation');
    try {
      const api = await axios.post(url, { password });
      return [api.status === 204 ? 1 : 0, api.data.message || ''];
    } catch (error) {
      return [0, error.response.data];
    }
  }

  /* Get password compromise status from the erasys password compromise api */
  async checkFromPasswordCompromisedApi(password: string) {
    const url =
      this.configService.get('api.compromised') +
      '?password=' +
      encodeURIComponent(password);

    try {
      const api = await axios.get(url);
      return [
        api.status === 204 ? 1 : 0,
        api.status === 200 ? api.data.message : '',
      ];
    } catch (error) {
      return [0, error.response.data];
    }
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
