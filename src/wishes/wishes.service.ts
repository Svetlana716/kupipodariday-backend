import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { In, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number): Promise<Wish> {
    const owner = await this.usersService.findUser({ where: { id: userId } });
    const wish = await this.wishRepository.create({ ...createWishDto, owner });
    return this.wishRepository.save(wish);
  }

  async findLast(): Promise<Wish[]> {
    return await this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  async findTop(): Promise<Wish[]> {
    return await this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 20,
    });
  }

  async findWish(id: number): Promise<Wish> {
    return await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async findWishes(id: number[]): Promise<Wish[]> {
    return await this.wishRepository.findBy({
      id: In(id),
    });
  }

  async update(userId: number, wishId: number, updateWishDto: UpdateWishDto) {
    const { price } = updateWishDto;
    const owner = await this.usersService.findUser({ where: { id: userId } });
    const wish = await this.findWish(wishId);

    if (!owner)
      throw new UnauthorizedException(
        'Редактировать можно только свои желания',
      );

    if (!wish) throw new NotFoundException('Подарок не найден');

    if (wish.offers.length > 0 && price) {
      throw new BadRequestException(
        'нельзя изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }

    return await this.wishRepository.save({ ...wish, ...updateWishDto });
  }

  async remove(userId: number, wishId: number) {
    const owner = await this.usersService.findUser({ where: { id: userId } });

    if (!owner)
      throw new UnauthorizedException('Удалять можно только свои желания');

    return this.wishRepository.delete(wishId);
  }

  async changeWish(wishId: number, change) {
    const wish = await this.findWish(wishId);

    if (!wish) throw new NotFoundException('Подарок не найден');

    return await this.wishRepository.save({ ...wish, change });
  }

  async copy(userId: number, wishId: number) {
    const owner = await this.usersService.findUser({ where: { id: userId } });
    const wish = await this.findWish(wishId);
    this.changeWish(wishId, { copied: wish.copied + 1 });
    const copiedWish = await this.wishRepository.create({
      ...wish,
      owner,
      raised: 0,
    });
    return this.wishRepository.save(copiedWish);
  }
}
