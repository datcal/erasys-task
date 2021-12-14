import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CliHelperService } from './cli-helper/cli-helper.service';
import { CliHelperModule } from './cli-helper/cli-helper.module';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(AppModule, {
    logger:
      process.env.ENV === 'true'
        ? ['debug', 'error', 'log', 'verbose', 'warn']
        : ['error', 'warn'],
  });
  const command = process.argv[2];

  switch (command) {
    case 'check-passwords':
      const cliHelperService: CliHelperService = application
        .select(CliHelperModule)
        .get(CliHelperService);

      await cliHelperService.check();
      break;
    case 'check-passwords-compromised':
      /*const compromisedPasswordService: CompromisedPasswordService = application
        .select(CompromisedPasswordModule)
        .get(CompromisedPasswordService);

      const checkPasswordCompromisedResult =
        await compromisedPasswordService.checkCompromised('#nxzr1Bp');
      console.log(checkPasswordCompromisedResult);*/
      break;
    default:
      console.log('Command not found');
      process.exit(1);
  }

  await application.close();
  process.exit(0);
}

bootstrap();
