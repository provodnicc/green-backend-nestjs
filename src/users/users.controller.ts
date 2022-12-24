import { Controller, Get } from '@nestjs/common';
import { Role } from 'src/auth/enums/roles.enum';
import { GetUserDto } from './dtos/get-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(){
    const users = await this.usersService.getUsers()
    return users.map((user: User)=>{
      if(user.role==Role.ADMIN){
        return
      }
      return new GetUserDto(user)
    })
  }
}
