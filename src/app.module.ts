import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PasswordModule } from './password/password.module';
import validation from 'config/validation';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [validation],
      isGlobal: true,
    }),
    PasswordModule,
  ],
})
export class AppModule {}
