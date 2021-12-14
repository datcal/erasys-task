import { Controller, Post, Body, Res } from '@nestjs/common';
import { PasswordService } from './password.service';

@Controller('passwords')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post()
  check(@Res() response, @Body('password') password: string): void {
    const [status, error] = this.passwordService.check(password);
    if (status) {
      response.status(400).json(error);
    } else {
      response.status(204).json();
    }
  }
}
