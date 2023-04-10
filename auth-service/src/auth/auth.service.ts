import {HttpException, HttpStatus, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../user/users.service";
import * as bcrypt from 'bcryptjs'
import {User} from "../user/user.model";
import {RegistrationDto} from "./dto/registration.dto";
import {JwtService} from "@nestjs/jwt";
import {ClientProxy, ClientProxyFactory, EventPattern, MessagePattern, Transport} from "@nestjs/microservices";
import {firstValueFrom, lastValueFrom, Observable} from "rxjs";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {Profile} from "../profile/profile.model";

@Injectable()
export class AuthService {
    constructor(private userService: UsersService,
                private jwtService: JwtService,
                @InjectModel(User) private userRepository: typeof User,
                @Inject('PROFILE_SERVICE') private readonly profileClient: ClientProxy,
                @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {
    }

    async register(dto: RegistrationDto) {
        const candidate = await this.userService.getUserByEmail(dto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким e-mail уже существует', HttpStatus.BAD_REQUEST);
        }

        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userService.createUser({...dto, password: hashPassword});
        const profile = await firstValueFrom(this.profileClient.send('create_profile', {
            email: dto.email,
            fullName: dto.fullName,
            phone: dto.phone,
            userId: user.id
        }))

        return this.generateToken(user, profile);
    }

    async deleteUser(id: number) {
        const user = await this.userRepository.findByPk(id);
        await user.destroy();
    }

    private async generateToken(user: User, profile: any) {
        const payload = {email: user.email, id: user.id, roles: user.roles, profile: profile}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    async login(dto: CreateUserDto) {
        const user = await this.validateUser(dto);
        return user;
    }

    private async validateUser(dto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(dto.email);
        const passwordEquals = await bcrypt.compare(dto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный E-Mail или Пароль'})
    }
}
