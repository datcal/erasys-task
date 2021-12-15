import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import validation from '../config/validation';
import configuration from '../config/configuration';
import { CliHelperModule } from './cli-helper/cli-helper.module';
import { PasswordModule } from './password/password.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [validation, configuration],
      isGlobal: true,
      cache: false,
    }),
    PasswordModule,
    CliHelperModule,
  ],
})
export class AppModule {}
