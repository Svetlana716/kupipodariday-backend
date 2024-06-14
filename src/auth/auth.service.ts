import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { veryfyHash } from 'src/helpers/hash';
import { IUser } from 'src/types/types';
import { UsersService } from 'src/users/users.service';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findUser({
        select: {
          username: true,
          password: true,
          id: true,
        },
        where: { username },
      });

      const passwordIsMatch = await veryfyHash(password, user.password);

      if (user && passwordIsMatch) {
        const { password, ...result } = user;
        return result;
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new UnauthorizedException('Некорректная пара логин и пароль');
      }
    }
  }
  async login(user: IUser): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync({ payload }),
    };
  }
}
