import { Controller, Post, Body, Res } from '@nestjs/common';
import { PasswordService } from './password.service';

@Controller('passwords')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post()
  check(@Res() res, @Body('password') password: string): void {
    const [status, error] = this.passwordService.check(password);
    if (status) {
      res.status(400).json(error);
    } else {
      res.status(204).json();
    }
  }
}
