import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {UserRoles} from "./user-roles.model";
import {Role} from "./roles.model";
import {User} from "../user/user.model";
import {JwtModule} from "@nestjs/jwt";

@Module({
  providers: [RolesService],
  controllers: [],
  imports: [
    SequelizeModule.forFeature([Role, User, UserRoles]),
    JwtModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    })
  ],
  exports: [
      RolesService,
      JwtModule
  ]
})
export class RolesModule {}
