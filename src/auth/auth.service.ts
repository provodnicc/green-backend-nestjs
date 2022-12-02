import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetUserDto } from 'src/users/dtos/get-user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import * as argon2 from 'argon2'
import { TokensService } from 'src/tokens/tokens.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { Token } from 'src/tokens/entities/token.entity';
import { User } from 'src/users/entities/user.entity';
import { UserSession } from 'src/sessions/entities/session.entity';
import { Host } from 'src/interfaces/host.interface';
import { Request, Response } from 'express';
import { Oauth } from './enums/oauth.enum';
import { OauthDto } from './dtos/Oauth.dto';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private tokenService: TokensService,
        private sessionService: SessionsService
    ){}

    async Oauth(oauthUser: OauthDto, oauth: Oauth){
        const user = new User()
        user.email = oauthUser.email

        
        user.img = `https://avatars.yandex.net/get-yapic/${oauthUser.img_id}/islands-small`
        


        const db_user = await this.usersService.getUserByEmail(user.email)
        if(db_user){
            const userDto = new GetUserDto(db_user)
            const tokens = await this.tokenService.generateTokens({...userDto})
            const refreshToken = await this.tokenService.saveToken(tokens.refreshToken)

            return refreshToken
        }
        const newUser = await this.usersService.createOauth(user, oauth)

        const userDto = new GetUserDto(newUser)
        const tokens = await this.tokenService.generateTokens({...userDto})
        const refreshToken = await this.tokenService.saveToken(tokens.refreshToken)
        
        return tokens
    }

    async signUp(signUpDto: SignUpDto){
        const user = await this.usersService.getUserByEmail(signUpDto.email)
        if(user){
            if(user.oauth){
            throw new HttpException('пользователь уже существует в '+user.oauth, HttpStatus.CONFLICT)
            }
            throw new HttpException('пользователь уже существует', HttpStatus.CONFLICT)
        }
        const newUser = await this.usersService.create(signUpDto)
        if(!newUser){
            throw new HttpException('пользователь не был создан', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        const userDto = new GetUserDto(newUser)
        return userDto
    }

    async signIn(signInDto: SignInDto, host: Host){
        const user = await this.usersService.getOauthUserByEmail(signInDto.email)
        if(!user){
            throw new HttpException('пользователь не существует', HttpStatus.NOT_FOUND)
        }
        const isEquals = await argon2.verify(user.password, signInDto.password)
        if(!isEquals){
            throw new HttpException('Пароль неверый', HttpStatus.CONFLICT)
        }

        const userDto = new GetUserDto(user)
        const tokens = await this.tokenService.generateTokens({...userDto})
        const refreshToken = await this.tokenService.saveToken(tokens.refreshToken)

        await this.connectDevice(host, refreshToken, user)
        return {userDto, ...tokens}
    }

    async connectDevice(host: Host, refreshToken: Token, user: User){
        const session = await this.sessionService.getByHostInfo(host.hostName, host.agent, user)
        if(session){
            return await this.sessionService.update(session)
        }
        return await this.sessionService.create(host.hostName, host.agent, refreshToken, user)
    }

    async refresh(user: GetUserDto, refreshToken: string, host: Host){
        await this.tokenService.deleteToken(refreshToken)
        console.log(user)
        const findedUser = await this.usersService.getUserById(user.id)
        if(!findedUser){
            throw new HttpException('пользователь не найден!', HttpStatus.NOT_FOUND)
        }
        const tokens = await this.tokenService.generateTokens(user)
        const token = await this.tokenService.saveToken(tokens.refreshToken)
        
        await this.connectDevice(host, token, findedUser)
        return {...tokens, findedUser}
    }

    async logout(token: string){

        await this.tokenService.deleteToken(token)
    }

    getHostInfo(req: Request){
        const agent = req.headers['user-agent']
        const hostName = req.headers['host']
        return {agent, hostName}
    }
    
    setCookie(res: Response, refreshToken: string){
        res.cookie(
            'refreshToken',
            refreshToken,
            {
                maxAge: 1000*60*60,
                httpOnly:true,
                sameSite: 'none',
                secure: true
            }
        )
        return res
    } 
}