import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { hashValue } from 'src/helpers/hash';
import { isUserExist } from 'src/helpers/isUserExist';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  userSelectOptions,
  wishSelectOptions,
  relations,
} from 'src/helpers/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password } = createUserDto;

    await isUserExist.apply(this, [email, username]);

    const user = await this.userRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });
    return this.userRepository.save(user);
  }

  async findUser(query: FindOneOptions<User>) {
    return await this.userRepository.findOneOrFail(query);
  }

  async findMe(userId: number): Promise<User> {
    return await this.findUser({
      select: {
        email: true,
        ...userSelectOptions,
      },
      where: { id: userId },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, username, password } = updateUserDto;

    if (email || username) {
      await isUserExist.apply(this, [email, username]);
    }

    const user = await this.findUser({ where: { id } });

    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    return await this.userRepository.save({ ...user, ...updateUserDto });
  }

  async findWishes(condition): Promise<Wish[]> {
    const owner = await this.findUser({
      select: {
        ...userSelectOptions,
        wishes: {
          ...wishSelectOptions,
          owner: { ...userSelectOptions },
        },
      },
      where: condition,
      relations: {
        wishes: {
          owner: true,
          offers: relations,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return owner?.wishes || [];
  }

  async findUserByUsername(name: string): Promise<User> {
    return await this.findUser({
      select: userSelectOptions,
      where: [{ username: name }, { email: name }],
    });
  }

  async findAll(query: string): Promise<User[]> {
    return await this.userRepository.find({
      select: userSelectOptions,
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
  }
}
