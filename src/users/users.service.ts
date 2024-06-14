import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { hashValue } from 'src/helpers/hash';
import { isUserExist } from 'src/helpers/isUserExist';
import { Wish } from 'src/wishes/entities/wish.entity';

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

  async findMeWishes(userId: number): Promise<Wish[]> {
    const owner = await this.findUser({
      where: { id: userId },
      relations: {
        wishes: {
          owner: true,
          offers: true,
        },
      },
    });
    return owner?.wishes || [];
  }

  async findAll(query: string): Promise<User[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
  }

  async findUser(query: FindOneOptions<User>) {
    return await this.userRepository.findOneOrFail(query);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, username, password } = updateUserDto;

    await isUserExist.apply(this, [email, username]);

    const user = await this.findUser({ where: { id } });

    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    return await this.userRepository.save({ ...user, ...updateUserDto });
  }
}
