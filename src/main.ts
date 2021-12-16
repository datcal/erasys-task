import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.APP_DEBUG === 'true'
        ? ['debug', 'error', 'log', 'verbose', 'warn']
        : ['error', 'warn'],
  });
  app.enableCors();
  await app.listen(process.env.PORT);
}

bootstrap().then(console.log).catch(console.error);
