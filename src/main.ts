import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV, setupSwagger } from './config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  setupSwagger(app);

  await app.listen(ENV.APP_PORT ?? 3000);
}
bootstrap();
