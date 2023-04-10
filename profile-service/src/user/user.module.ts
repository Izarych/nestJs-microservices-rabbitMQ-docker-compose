import {Module} from "@nestjs/common";
import {UserService} from "./user.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./user.model";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";
import {RolesModule} from "../roles/roles.module";


@Module({
    controllers: [],
    providers: [UserService],
    imports: [
        SequelizeModule.forFeature([User, Role, UserRoles]),
        RolesModule
    ],
    exports: [
        UserService
    ]
})
export class UsersModule {}