import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthUser } from 'src/common/decorators/auth.decorator';
import { IUser } from 'src/types/types';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@AuthUser() user: IUser): Promise<any> {
    return this.authService.login(user);
  }
}
