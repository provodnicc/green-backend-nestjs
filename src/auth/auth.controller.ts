import { Body, Controller, Delete, Get, Patch, Post, Req, Res, UseGuards, Ip } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Host } from 'src/interfaces/host.interface';
import { GetUserDto } from 'src/users/dtos/get-user.dto';
import { AuthService } from './auth.service';
import { OauthDto } from './dtos/Oauth.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { Oauth } from './enums/oauth.enum';
import { RefreshGuard } from './guards/rt.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('sign-up')
  @ApiOperation({summary: 'sig-up user'})
  async signUp(
    @Body()
    signUpDto: SignUpDto
  ){
    return await this.authService.signUp(signUpDto)
  }

  @Post('yandex')
  // @UseGuards(AuthGuard('yandex'))
  async Oauth(
    @Body()
    oauth: OauthDto,

    @Res()
    res: Response

  ){

    const oauthDto = await this.authService.Oauth(oauth, Oauth.YANDEX)
    this.authService.setCookie(res, oauthDto.refreshToken)
    return res.send()
  }

  @Get('/callback/yandex')
  @ApiOperation({summary: 'oauth via other services'})
  @UseGuards(AuthGuard('yandex'))
  async OauthCallback(
    @Req()
    req: Request,

    @Res()
    res: Response

  ){

    const user = req.user
    // const oauthDto = await this.authService.Oauth(user, Oauth.YANDEX)
    // this.authService.setCookie(res, oauthDto.refreshToken)  
    // return res.send()
  }

  @Post('sign-in')
  @ApiOperation({summary: 'sign-in user'})
  async signIn(
    @Ip()
    IP: any,

    @Req()
    req: Request,

    @Body()
    signInDto: SignInDto,

    @Res({passthrough: true })
    res: Response,
  ){
    const host = this.authService.getHostInfo(req, IP)
    const context = await this.authService.signIn(signInDto, host)

    this.authService.setCookie(res, context.refreshToken)
    return context.accessToken
  }
  
  @UseGuards(RefreshGuard)
  @Get('refresh')
  @ApiOperation({summary: 'refresh token pair by cookie'})
  async refresh(
    @Ip()
    IP: any,
    @Req()
    req: Request,

    @Res({passthrough: true})
    res: Response
  ){
    console.log(IP)
    const host: Host = this.authService.getHostInfo(req, IP)
    const user = new GetUserDto({...req.user})
    const token: string = req.cookies['refreshToken']

    const data = await this.authService.refresh(user, token, host)
    this.authService.setCookie(res, data.refreshToken)
    return {
      token: data.accessToken,
      user: {
        id: data.findedUser.id,
        email: data.findedUser.email,
        img: data.findedUser.img,

      }
    }
  }

  @UseGuards(RefreshGuard)
  @Delete('logout')
  @ApiOperation({summary: 'remove cookie and session'})
  async logOut(
    @Res({passthrough: true})
    res: Response,

    @Req()
    req: Request
  ){
    const token = req.cookies['refreshToken']
    
    await this.authService.logout(token)
    res.clearCookie('refreshToken')
  }

  // @UseGuards(JWTAuthGuard, RolesGuard)
  // @Get('check')
  // @Roles(Role.USER, Role.ADMIN)
  // async check(@Req() req){
  //   console.log(req)
  //   return req.user
  // }
}
