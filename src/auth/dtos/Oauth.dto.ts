import { Oauth } from "../enums/oauth.enum"
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"


export class OauthDto{
    
    @ApiProperty({default: 'yandex@ayndex.ru'})
    @IsEmail()
    email: string
    
    @ApiProperty({default: 'https://avatars.yandex.net/get-yapic/0/0-0/islands-small'})
    @IsString()
    image: string

    @ApiProperty({default: Oauth.YANDEX})
    @IsEnum({enum: Oauth})
    @IsNotEmpty()
    oauth: Oauth

    token: string
}