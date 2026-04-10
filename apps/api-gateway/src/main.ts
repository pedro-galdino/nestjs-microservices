import { ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupDocs } from './docs/setup-docs';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters();
  setupDocs(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
