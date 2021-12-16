import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { PasswordService } from './password.service';

@Controller('passwords')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post()
  check(@Res() response: Response, @Body('password') password: string) {
    const [status, error]: Array<number | string[]> =
      this.passwordService.check(password);
    if (status) {
      response.status(400).json(error);
    } else {
      response.status(204).json();
    }
  }
}
