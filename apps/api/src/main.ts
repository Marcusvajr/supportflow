import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readCorsConfig } from './common/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = process.env.GLOBAL_PREFIX ?? 'api/v1';
  const port = Number(process.env.PORT ?? process.env.BACKEND_PORT ?? 3001);

  app.setGlobalPrefix(globalPrefix);
  app.enableCors(readCorsConfig());

  await app.listen(port, '0.0.0.0');
}

void bootstrap();
