import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2'
import { Oauth } from 'src/auth/enums/oauth.enum';
import { OauthDto } from 'src/auth/dtos/Oauth.dto';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}
    
    async create(user: CreateUserDto){
        const encrypted = user
        encrypted.password = await argon2.hash(encrypted.password)
        return await this.userRepository.save(encrypted)
    }

    async createOauth(oauthUaer: OauthDto, oauth: Oauth){
        const user = this.userRepository.create()
        user.email = oauthUaer.email
        user.img = oauthUaer.img
        user.oauth = oauth
        user.password = null
        return await this.userRepository.save(user)
    }

    async update(user: User){
        return await this.userRepository.save(user)
    }

    async getUserById(id: number){
        const user = await this.userRepository.findOneBy({id: id})
        return user
    }

    async getUserByEmail(email: string){
        if(!email){
            return null
        }
        const user = await this.userRepository.findOneBy({email: email})
        return user
    }

    async getOauthUserByEmail(email){
        if(!email){
            return null
        }
        const user = await this.userRepository.findOneBy({email: email, oauth: null})
        return user
    }
    async getUsers(){
        return await this.userRepository.find({
            relations: ['sessions']
        })
    }
}
