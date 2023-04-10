import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import {SequelizeModule} from "@nestjs/sequelize";;
import {UserRoles} from "./user-roles.model";
import {Role} from "./roles.model";
import {User} from "../user/user.model";

@Module({
  providers: [RolesService],
  controllers: [],
  imports: [
    SequelizeModule.forFeature([Role, User, UserRoles])
  ],
  exports: [
      RolesService
  ]
})
export class RolesModule {}
