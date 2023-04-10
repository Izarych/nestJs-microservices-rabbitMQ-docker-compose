import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./user.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User,
                private roleServices: RolesService) {
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email: email}, include: {all:true}})
        return user;
    }
    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        const role = await this.roleServices.getRoleByValue("USER");
        await user.$set('roles', [role.id]);
        user.roles = [role];
        return this.userRepository.findByPk(user.id, {include: {all: true}});
    }
}