import {BelongsToMany, Column, DataType, HasOne, Model, Table} from "sequelize-typescript";
import {Profile} from "../profile/profile.model";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";


@Table({tableName: 'users'})
export class User extends Model<User> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @Column({type: DataType.STRING, allowNull: true})
    banReason: string;

    @HasOne(() => Profile)
    profile: Profile

    @BelongsToMany(() => Role, ()=> UserRoles)
    roles: Role[]
}