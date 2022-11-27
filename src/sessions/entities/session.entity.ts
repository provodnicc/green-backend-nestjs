import { User } from "../../users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Token } from "../../tokens/entities/token.entity";

@Entity()
export class UserSession{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    host: string

    @Column()
    agent: string

    @OneToOne(()=>Token,(token)=>token.id,{
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn()
    token: Token

    @ManyToOne(()=>User, (user)=>user.sessions, { 
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    user: User

    @Column({default: new Date()})
    createdAt: Date

    @Column({default: new Date()})
    updatedAt: Date

}