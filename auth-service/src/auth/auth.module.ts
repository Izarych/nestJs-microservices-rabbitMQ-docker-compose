import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ConfigModule} from "@nestjs/config";
import {UsersModule} from "../user/users.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../user/user.model";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";
import {Profile} from "../profile/profile.model";
import {JwtModule} from "@nestjs/jwt";
import {UsersService} from "../user/users.service";
import {ProfileModule} from "../profile/profile.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      ClientsModule.register([{
          name: 'PROFILE_SERVICE',
          transport: Transport.RMQ,
          options: {
              urls: ['amqp://rabbitmq:5672'],
              queue: 'profile_queue',
              queueOptions: {
                  durable: true
              }
          }
      }]),
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
      SequelizeModule.forFeature([User, Role, UserRoles, Profile]),
      ConfigModule,
    forwardRef(() => UsersModule),
      JwtModule.register({
          secret: process.env.PRIVATE_KEY || 'SECRET',
          signOptions: {
              expiresIn: '24h'
          }
      })
  ],
  exports: [
      AuthService,
      JwtModule
  ]
})
export class AuthModule {}
