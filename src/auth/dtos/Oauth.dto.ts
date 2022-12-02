import { Oauth } from "../enums/oauth.enum"
import { IsEmail, IsString } from 'class-validator'
import { ApiProperty } from "@nestjs/swagger"


export class OauthDto{
    
    @ApiProperty({default: 'yandex@yandex.ru'})
    @IsEmail()
    email: string
    
    @ApiProperty({default: 'https://avatars.yandex.net/get-yapic/0/0-0/islands-small'})
    @IsString()
    img_id: string

    // @ApiProperty({default: 'aaa'})
    // token: string
}