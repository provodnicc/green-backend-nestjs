import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-yandex";

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex'){
    constructor(){
        super({
            clientID: 'e961a55c58e340b7a555e70dd7d9136b',
            clientSecret: '911bf193858b4b37b4b4a874c14d0e99',
            callbackURL: 'http://127.0.0.1:5000/auth/callback/yandex'
        })
    }

    validate(accessToken: any, refreshToken: any, profile: any) {
        return profile
    }
    
}