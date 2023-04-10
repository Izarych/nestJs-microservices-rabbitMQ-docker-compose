import {Role} from "../roles/roles.model";
import {User} from "../user/user.model";
import {AppModule} from "../app.module";
import {INestApplication, NotFoundException} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {Test} from "@nestjs/testing";
import {ConfigModule} from "@nestjs/config";
import {UserRoles} from "../roles/user-roles.model";
import {Profile} from "../profile/profile.model";
import {AuthService} from "../auth/auth.service";
import * as request from 'supertest'
import * as bcrypt from 'bcryptjs'
import {UsersService} from "../user/users.service";
import {RolesService} from "../roles/roles.service";

describe('AuthTests', () => {
    let app: INestApplication;
    let authService: AuthService;
    let userService: UsersService;
    let roleService: RolesService;
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
        authService = moduleRef.get<AuthService>(AuthService);
        userService = moduleRef.get<UsersService>(UsersService);
        roleService = moduleRef.get<RolesService>(RolesService);
        await app.init();

    });

    afterAll(async () => {
        await app.close();
    })

    beforeEach(async () => {
        jest.restoreAllMocks();
    })

    describe('/login', () => {

        it('should login user', async () => {
            const user = new User();
            user.email = 'test@mail.ru'
            user.password = 'password'

            const dto = {
                email: 'test@mail.ru',
                password: 'password'
            }

            jest.spyOn(authService, 'login').mockResolvedValue(user);

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(dto)
                .expect(201)

            expect(response.body).toEqual(user.toJSON())
            expect(authService.login).toHaveBeenCalledWith(dto)

        })

        it('should throw an error if e-mail or password is incorrect', async () => {
            const dto = {
                email: 'test@mail.ru',
                password: '12345'
            }
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(dto)
                .expect(401)

            expect(response.body.message).toEqual('Некорректный E-Mail или Пароль')
        })
    })

    describe('/registration', () => {
        it ('should register user', async () => {
            const user = new User();
            user.email = 'test@mail.ru';
            user.password = 'password';

            const dto = {
                email: 'test@mail.ru',
                password:'password'
            }

            jest.spyOn(authService, 'register').mockResolvedValue({token: 'jwt-token'})

            const response = await request(app.getHttpServer())
                .post('/auth/registration')
                .send(dto)
                .expect(201)

            expect(response.body).toEqual({token: 'jwt-token'})
            expect(authService.register).toHaveBeenCalledWith(dto);
        })

        it ('should throw an error if user exist', async () => {

            const dto = {
                email: 'test@mail.ru',
                password: 'password'
            }

            const response = await request(app.getHttpServer())
                .post('/auth/registration')
                .send(dto)
                .expect(400)

            expect(response.body.message).toEqual('Пользователь с таким e-mail уже существует')
        })

        it('should return correct hash password when creating user', async () => {
           const dto = {
               email: 'test@mail.ru',
               password: 'password'
           }
           const hashPassword = await bcrypt.hash(dto.password, 5);
           const user = new User();
           jest.spyOn(userService, 'createUser').mockImplementation(async (dto) => {
               user.password = hashPassword;
               return user
           });
           const createdUser = await userService.createUser(dto);
           
           expect(createdUser).toBe(user);
           expect(user.password).toBe(hashPassword);
        })

        it ('should throw error when role is not found', async () => {
            const dto = {
                email: 'test@777mail.ru',
                password: 'password'
            }
            jest.spyOn(roleService, 'getRoleByValue').mockRejectedValueOnce(new NotFoundException('Роль с таким значением не найдена'))


            await expect(userService.createUser(dto)).rejects.toThrow(NotFoundException);

        })
    })
})