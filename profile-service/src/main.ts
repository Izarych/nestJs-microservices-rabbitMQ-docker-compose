import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'profile_queue',
      queueOptions: {
        durable: true
      }
    }
  })
  await app.startAllMicroservices();
  await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}


bootstrap();
