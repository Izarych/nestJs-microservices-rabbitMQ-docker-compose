import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../user/user.model";

@Table({tableName: 'profile'})
export class Profile extends Model<Profile> {
    @Column({type: DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    fullName: string;

    @Column({type: DataType.STRING, unique:true, allowNull: true})
    phone: string;

    @Column({type: DataType.STRING, allowNull: false})
    email:string;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User
}