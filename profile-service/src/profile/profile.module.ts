import {Module} from '@nestjs/common';
import {ProfileController} from './profile.controller';
import {ConfigModule} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ProfileService} from "./profile.service";
import {UsersModule} from "../user/user.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../user/user.model";
import {Profile} from "./profile.model";
import {ROLES_KEY} from "../roles/roles-auth.decorator";
import {RolesModule} from "../roles/roles.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
      ClientsModule.register([
          {
              name: 'PROFILE_SERVICE',
              transport: Transport.RMQ,
              options: {
                  urls: ['amqp://rabbitmq:5672'],
                  queue: 'profile_queue',
                  queueOptions: {
                      durable: true
                  }
              }
          }
      ]),
      ClientsModule.register([
          {
              name: 'AUTH_SERVICE',
              transport: Transport.RMQ,
              options: {
                  urls: ['amqp://rabbitmq:5672'],
                  queue: 'auth_queue',
                  queueOptions: {
                      durable: true
                  }
              }
          }
      ]),
      SequelizeModule.forFeature([Profile]),
      ConfigModule,
      UsersModule,
      RolesModule,
  ],
  exports: [
      ProfileService
  ]
})
export class ProfileModule {}
