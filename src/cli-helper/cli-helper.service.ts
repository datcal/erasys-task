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
  async check() {
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

  /* Get password compromise status from the password compromise api */
  async checkFromPasswordCompromisedApi(password: string) {
    const url =
      this.configService.get('api.compromised') +
      '?password=' +
      encodeURIComponent(password);

    const api = await axios.get(url);
    return [api.status === 200 ? 0 : 1, api.data.message || ''];
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