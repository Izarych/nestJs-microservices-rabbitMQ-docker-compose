import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import {User} from "../user/user.model";

@Module({
  providers: [],
  controllers: [],
  imports: [
      SequelizeModule.forFeature([Profile, User])

  ]
})
export class ProfileModule {}
