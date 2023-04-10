import {Test} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import {ConfigModule} from "@nestjs/config";
import {getModelToken, SequelizeModule} from "@nestjs/sequelize";
import {Profile} from "../../profile/profile.model";
import {User} from "../../user/user.model";
import {Role} from "../../roles/roles.model";
import {UserRoles} from "../../roles/user-roles.model";
import {ProfileService} from "../../profile/profile.service";
import * as request from 'supertest';
import {INestApplication} from "@nestjs/common";



describe('ProfileController', () => {
    let app: INestApplication;
    let profileService: ProfileService;
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({
                envFilePath: `.${process.env.NODE_ENV}.env`
            }),
                SequelizeModule.forRoot({
                    dialect: 'postgres',
                    host: process.env.POSTGRES_HOST,
                    port:Number(process.env.POSTGRES_PORT),
                    username: process.env.POSTGRES_USER,
                    password: process.env.POSTGRES_PASSWORD,
                    database: process.env.POSTGRES_DB,
                    models: [Profile, User, Role, UserRoles],
                    autoLoadModels: true
                }),
                AppModule]
        }).compile()

        app = moduleRef.createNestApplication();
        profileService = moduleRef.get<ProfileService>(ProfileService);
        await app.init();

    });

    afterAll(async () => {
        await app.close();
    })



    describe('/delete', () => {
        const id = 1;
        const endpoint = `/profile/${id}`
        const updateDto = {fullName: "testUpdate"};

        afterEach(async () => {
            jest.clearAllMocks();
        })

        it('should not update profile when body is empty', async () => {
            const profile = new Profile();
            profile.id = id;
            profile.fullName = 'testName123'

            jest.spyOn(profileService, 'updateProfile');

            const response = await request(app.getHttpServer())
                .put(endpoint)
                .send({})
                .expect(400);

            expect(response.body.message).toBe('Значения для обновления профиля не указаны');

        })

        it ('should update profile', async () => {
            const profile = new Profile();
            profile.id = id;
            profile.fullName = 'Artyom Plyusch';



            jest.spyOn(profileService, 'updateProfile')
                .mockImplementation(async (id, updateDto) => {
                    profile.fullName = updateDto.fullName;
                    return profile;
                })

            await request(app.getHttpServer())
                .put(endpoint)
                .send(updateDto)
                .expect(200);

            expect(profile.fullName).toEqual(updateDto.fullName);
            expect(profileService.updateProfile).toHaveBeenCalledWith(id.toString(), updateDto);
        })


    })
    describe('/delete', () => {
        afterEach(async () => {
            jest.clearAllMocks();
        })

        it('should delete profile and return message', async () => {
            const user = new User();
            user.id = 2;
            user.email = 'testemail)@#@!@mail.ru';

            const profile = new Profile();
            profile.id = 1;
            profile.userId = user.id;
            profile.fullName = 'Artyom Plyusch';

            jest.spyOn(profileService, 'deleteProfile').mockResolvedValue({
                message: `Профиль с id ${profile.id} и пользователь с Id: ${profile.userId} были удалены`
            })
            const response = await request(app.getHttpServer())
                .delete(`/profile/${profile.id}`)
                .expect(200)

            expect(response.body).toEqual({
                message: `Профиль с id ${profile.id} и пользователь с Id: ${profile.userId} были удалены`
            })
        })

        it('should throw 404 when no id in request', async () => {

            const response = await request(app.getHttpServer())
                .delete(`/profile/`)
                .expect(404)

            expect(response.body.error).toEqual('Not Found')

        })


    })
})