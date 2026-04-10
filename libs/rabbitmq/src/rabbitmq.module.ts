import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({})
export class RabbitMQModule {
  static register(service: string, queue: string): DynamicModule {
    const rabbitmqUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';

    return {
      module: RabbitMQModule,
      imports: [
        ClientsModule.register([
          {
            name: service,
            transport: Transport.RMQ,
            options: {
              urls: [rabbitmqUrl],
              queue: queue,
              queueOptions: { durable: false }
            }
          }
        ])
      ],
      exports: [ClientsModule]
    };
  }
}
