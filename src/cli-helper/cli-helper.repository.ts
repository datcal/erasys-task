import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, In, FindOperator } from 'typeorm';
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
  async updatePassword(
    passwords: any[] | FindOperator<unknown>,
    valid: number,
  ) {
    await getConnection()
      .createQueryBuilder()
      .update(Password)
      .set({ valid })
      .where({ password: In(passwords) })
      .execute();
  }

  /* Get password validation status from the password validation api */
  async checkFromPasswordValidationApi(password: string) {
    const url: string = this.configService.get('api.validation');
    try {
      const api: { status: number; data: { message: string[] } } =
        await axios.post(url, { password });
      const result: [number, string[] | string] = [
        api.status === 204 ? 1 : 0,
        api.data.message || '',
      ];
      return result;
      /* eslint-disable
        @typescript-eslint/no-unsafe-assignment
      */
    } catch (error) {
      const result: [number, string[] | string] = [0, error.response.data];
      return result;
    }
    /* eslint-enable */
  }

  /* Get password compromise status from the erasys password compromise api */
  async checkFromPasswordCompromisedApi(password: string) {
    let url: string = this.configService.get('api.compromised');
    url += '?password=' + encodeURIComponent(password);
    try {
      const api: { status: number; data: { message: string } } =
        await axios.get(url);
      const result = [
        api.status === 204 ? 1 : 0,
        api.status === 200 ? api.data.message : '',
      ];
      return result;
    } catch (error: any) {
      const result: [number, any] = [0, error.response.data];
      return result;
    }
  }
}
