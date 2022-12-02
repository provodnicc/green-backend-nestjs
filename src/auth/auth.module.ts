import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../tokens/entities/token.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import {JwtModule} from '@nestjs/jwt'
import { RTStrategy } from './strategies/RT.strategy';
import { ATStrategy } from './strategies/AT.strategy';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { AccessGuard } from './guards/ac.guard';
import { UserSession } from '../sessions/entities/session.entity';
import { TokensService } from 'src/tokens/tokens.service';
import { TokensModule } from 'src/tokens/tokens.module';
import { SessionsService } from 'src/sessions/sessions.service';
import { SessionsModule } from 'src/sessions/sessions.module';
import { YandexStrategy } from './strategies/yndex.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([Token, UserSession]),
    JwtModule,
    UsersModule,
    PassportModule,
    TokensModule,
    SessionsModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    UsersService,
    RTStrategy, 
    ATStrategy,
    YandexStrategy,
    RolesGuard,
    AccessGuard,
    TokensService,
    SessionsService
  ]
})
export class AuthModule {}
