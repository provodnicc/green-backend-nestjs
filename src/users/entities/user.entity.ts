import { UserSession } from "../../sessions/entities/session.entity";
import { Role } from "../../auth/enums/roles.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Oauth } from "src/auth/enums/oauth.enum";



@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column({nullable: true})
    password: string

    @Column({nullable: true, default: 'https://avatars.dzeninfra.ru/get-yapic/0/0-0/islands-small'})
    img: string

    @Column({default: Role.USER})
    role: string

    @Column({default: null})
    oauth: Oauth

    @OneToMany(()=>UserSession, (usersession)=>usersession.user)
    sessions: UserSession[]
}