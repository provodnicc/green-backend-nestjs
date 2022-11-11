import { Body, Controller, Delete, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Host } from 'src/interfaces/host.interface';
import { GetUserDto } from 'src/users/dtos/get-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { RefreshGuard } from './guards/rt.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
  @Post('sign-up')
  async signUp(
    @Body()
    signUpDto: SignUpDto
  ){
    console.log(signUpDto)

    return await this.authService.signUp(signUpDto)
  }

  @Post('sign-in')
  async signIn(
    @Req()
    req: Request,
    
    @Body()
    signInDto: SignInDto,

    @Res({passthrough: true })
    res: Response,
  ){
    console.log(signInDto)
    const host = this.authService.getHostInfo(req)
    const context = await this.authService.signIn(signInDto, host)
    this.authService.setCookie(res, context.refreshToken)
    return context
  }
  
  @UseGuards(RefreshGuard)
  @Patch('refresh')
  async refresh(
    @Req()
    req: Request,

    @Res({passthrough: true})
    res: Response
  ){
    const host: Host = this.authService.getHostInfo(req)
    const user = new GetUserDto({...req.user})
    const token: string = req.cookies['refreshToken']

    const tokens = await this.authService.refresh(user, token, host)
    this.authService.setCookie(res, tokens.refreshToken)
    return tokens.accessToken
  }

  @UseGuards(RefreshGuard)
  @Delete('logout')
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
