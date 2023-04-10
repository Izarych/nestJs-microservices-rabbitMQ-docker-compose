import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./user/user.model";
import {ProfileModule} from './profile/profile.module';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {Role} from "./roles/roles.model";
import {UserRoles} from "./roles/user-roles.model";
import {AuthModule} from "./auth/auth.module";
import {UsersModule} from "./user/users.module";
import {RolesModule} from "./roles/roles.module";
import {Profile} from "./profile/profile.model";


@Module({
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
      ConfigModule.forRoot({
        envFilePath: `.${process.env.NODE_ENV}.env`
      }),
      SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.POSTGRES_HOST,
          port:Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          models: [User, Role, UserRoles, Profile],
          autoLoadModels: true
      }),
      ProfileModule,
      UsersModule,
      AuthModule,
      RolesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
