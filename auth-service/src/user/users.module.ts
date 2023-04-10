import {forwardRef, Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./user.model";
import {AuthModule} from "../auth/auth.module";
import {UsersService} from "./users.service";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";
import {Profile} from "../profile/profile.model";
import {ProfileModule} from "../profile/profile.module";
import {RolesModule} from "../roles/roles.module";


@Module({
    controllers: [],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([User, Role, UserRoles, Profile]),
        RolesModule,
        forwardRef(() => AuthModule)
    ],
    exports: [
        UsersService
    ]
})
export class UsersModule {}