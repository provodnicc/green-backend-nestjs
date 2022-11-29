import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2'
import { Oauth } from 'src/auth/enums/oauth.enum';
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

    // async createOauth(oauth: Oauth){
    //     return await this.userRepository.save()
    // }

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

    async getUsers(){
        return await this.userRepository.find({
            relations: ['sessions']
        })
    }
}
