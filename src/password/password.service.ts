import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordService {
  pattern = [];
  match = [];
  message = [];
  constructor(private configService: ConfigService) {
    this.loadValidations();
  }

  loadValidations() {
    this.pattern = this.configService.get('pattern');
    this.match = this.configService.get('match');
    this.message = this.configService.get('message');
    //Logger.log(this.pattern);
  }

  check(password: string) {
    const error = this.getMatch(password);
    const status = error.length > 0 ? 1 : 0;
    return [status, error];
  }

  getMatch(s: string): string[] {
    const errors = [];
    this.pattern.forEach((pattern: RegExp, index) => {
      const regex = new RegExp(pattern);
      if (regex.test(s) == this.match[index]) {
        errors.push(this.message[index]);
      }
    });

    return errors;
  }
}
