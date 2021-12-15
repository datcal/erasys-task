import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';
import { Password } from '../entities/password.entity';

@Injectable()
export class CliHelperRepository {
  constructor(
    @InjectRepository(Password)
    private readonly passwordsRepository: Repository<Password>,
    private readonly configService: ConfigService,
  ) {}

  /* Get all passwords from the database */
  async getPasswords(): Promise<Password[]> {
    return this.passwordsRepository.find();
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

  /* Get password compromise status from the erasys password compromise api */
  async checkFromPasswordCompromisedApi(password: string) {
    let url: string = this.configService.get('api.compromised');
    url += '?password=' + encodeURIComponent(password);
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
}
