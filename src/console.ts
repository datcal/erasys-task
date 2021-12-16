import { exit } from 'node:process';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CliHelperService } from './cli-helper/cli-helper.service';
import { CliHelperModule } from './cli-helper/cli-helper.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger:
      process.env.APP_DEBUG === 'true'
        ? ['debug', 'error', 'log', 'verbose', 'warn']
        : ['error', 'warn'],
  });
  const command = process.argv[2];
  const cliHelperService: CliHelperService = app
    .select(CliHelperModule)
    .get(CliHelperService);

  switch (command) {
    case 'check-passwords':
      await cliHelperService.checkValidation();
      break;
    case 'check-passwords-compromised':
      await cliHelperService.checkCompromised();
      break;
    case 'full-check-passwords':
      await cliHelperService.checkValidationAndCompromised();
      break;
    default:
      console.log('Command not found');
      exit(1);
  }

  await app.close();
  exit(0);
}

bootstrap().then(console.log).catch(console.error);
