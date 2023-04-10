import {Body, Controller, Get, Inject, Param, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {
    ClientProxy,
    ClientProxyFactory,
    Ctx,
    EventPattern,
    MessagePattern,
    Payload,
    RmqContext,
    Transport
} from "@nestjs/microservices";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {lastValueFrom} from "rxjs";
import {User} from "../user/user.model";
import {RegistrationDto} from "./dto/registration.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
                @Inject('PROFILE_SERVICE') private readonly profileClient: ClientProxy) {}


    @EventPattern('delete_user')
    async deleteUser(id: number) {
        return this.authService.deleteUser(id);
    }

    @Post('/login')
    login(@Body() dto: CreateUserDto) {
        return this.authService.login(dto);
    }

    @Post('/registration')
    register(@Body() dto: RegistrationDto) {
        return this.authService.register(dto);
    }


}
