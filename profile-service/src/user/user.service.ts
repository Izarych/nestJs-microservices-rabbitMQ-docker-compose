import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./user.model";


@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userRepository: typeof User) {
    }


    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        return user;
    }
}