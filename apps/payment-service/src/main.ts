import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { RMQ_QUEUES } from '@shared';

import { AppModule } from './app.module';

async function bootstrap() {
  const rabbitmqUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: RMQ_QUEUES.payment,
      queueOptions: { durable: false }
    }
  });
  await app.listen();
}
bootstrap();
