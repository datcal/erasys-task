import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PasswordModule } from './password/password.module';
import validation from 'config/validation';
import configuration from 'config/configuration';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [validation, configuration],
      isGlobal: true,
    }),
    PasswordModule,
  ],
})
export class AppModule {}
