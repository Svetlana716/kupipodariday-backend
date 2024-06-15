import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { AuthUser } from 'src/common/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findOwn(@AuthUser() user: User): Promise<User> {
    return await this.usersService.findMe(user.id);
  }

  @Patch('me')
  async updateOne(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(user.id, updateUserDto);
  }

  @Get('me/wishes')
  async findMyWishes(@AuthUser() user: User): Promise<Wish[]> {
    return await this.usersService.findWishes({ id: user.id });
  }

  @Get(':username')
  async findUser(@Param('username') name: string): Promise<User> {
    return await this.usersService.findUserByUsername(name);
  }

  @Get(':username/wishes')
  async findUsersWishes(@Param('username') name: string): Promise<Wish[]> {
    return await this.usersService.findWishes([
      { username: name },
      { email: name },
    ]);
  }

  @Post('find')
  async find(@Body() body: { query: string }): Promise<User[]> {
    const { query } = body;
    return await this.usersService.findAll(query);
  }
}
