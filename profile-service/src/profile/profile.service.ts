import {HttpException, HttpStatus, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import {ClientProxy, ClientProxyFactory, Transport} from "@nestjs/microservices";


@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Profile) private profileRepository: typeof Profile,
        @Inject('PROFILE_SERVICE') private readonly profileClient: ClientProxy,
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
    ) {}

    async updateProfile(id: number, updateDto: Partial<Profile>) {
        if (Object.keys(updateDto).length === 0) {
            throw new HttpException('Значения для обновления профиля не указаны', HttpStatus.BAD_REQUEST)
        }
        const profile = await this.profileRepository.findByPk(id);
        if (!profile) {
            throw new NotFoundException(`Профиль с id ${id} не найден`)
        }

        await profile.update(updateDto);
        return profile;
    }


    async deleteProfile(id: number) {
        const profile = await this.profileRepository.findByPk(id);
        if (!profile) {
            throw new NotFoundException(`Профиль с id ${id} не был найден`);
        }
        await profile.destroy();
        await this.authClient.emit('delete_user', profile.userId);
        return {message: `Профиль с id ${id} и пользователь с Id: ${profile.userId} были удалены`}

    }


    async createProfile(data: any) {
        const profile = await this.profileRepository.create(data);
        return profile;
    }
}
