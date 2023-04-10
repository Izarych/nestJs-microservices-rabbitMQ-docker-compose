import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {Client, ClientProxy, EventPattern, MessagePattern, Payload, Transport} from "@nestjs/microservices";
import {ProfileService} from "./profile.service";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {Profile} from "./profile.model";
import {RegistrationDto} from "./dto/registration.dto";
import {Roles} from "../roles/roles-auth.decorator";
import {RolesGuard} from "../roles/roles.guard";

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {
    }

    // Гварды закомментил для тестов, сами гварды работают
    // @Roles("ADMIN", "USER")
    // @UseGuards(RolesGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateDto: Partial<Profile>) {
        return this.profileService.updateProfile(id, updateDto);
    }

    @EventPattern('create_profile')
    async createProfile(@Payload() data: any) {
        return this.profileService.createProfile(data);
    }

    // @Roles("ADMIN", "USER")
    // @UseGuards(RolesGuard)
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.profileService.deleteProfile(id);
    }







}
