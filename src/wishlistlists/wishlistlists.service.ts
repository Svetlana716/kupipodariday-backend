import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWishlistlistDto } from './dto/create-wishlistlist.dto';
import { UpdateWishlistlistDto } from './dto/update-wishlistlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlistlist } from './entities/wishlistlists.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import {
  userSelectOptions,
  wishSelectOptions,
  wishlistlistSelectOptions,
} from 'src/helpers/constants';

@Injectable()
export class WishlistlistsService {
  constructor(
    @InjectRepository(Wishlistlist)
    private readonly wishlistlistRepository: Repository<Wishlistlist>,
    private readonly usersService: UsersService,
    private readonly wishService: WishesService,
  ) {}

  async findAll(): Promise<Wishlistlist[]> {
    return await this.wishlistlistRepository.find({
      select: {
        ...wishlistlistSelectOptions,
        owner: { ...userSelectOptions },
        items: {
          ...wishSelectOptions,
          owner: { ...userSelectOptions },
        },
      },
      relations: {
        items: true,
        owner: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async create(
    createWishlistlistDto: CreateWishlistlistDto,
    userId: number,
  ): Promise<Wishlistlist> {
    const { itemsId } = createWishlistlistDto;
    const wishes = await this.wishService.findWishes(itemsId);
    const owner = await this.usersService.findUser({ where: { id: userId } });

    const wishlist = await this.wishlistlistRepository.create({
      ...createWishlistlistDto,
      items: wishes,
      owner,
    });
    return this.wishlistlistRepository.save(wishlist);
  }

  async findWishlistlist(
    userId: number,
    wishlistlistId: number,
  ): Promise<Wishlistlist> {
    const owner = await this.usersService.findUser({ where: { id: userId } });

    if (!owner) throw new UnauthorizedException('Необхоодима авторизация');

    return await this.wishlistlistRepository.findOne({
      select: {
        ...wishlistlistSelectOptions,
        owner: { ...userSelectOptions },
        items: {
          ...wishSelectOptions,
          owner: { ...userSelectOptions },
        },
      },
      where: { id: wishlistlistId },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async update(
    userId: number,
    wishlistlistId: number,
    updateWishlistlistDto: UpdateWishlistlistDto,
  ) {
    const owner = await this.usersService.findUser({ where: { id: userId } });
    const wishlistlist = await this.findWishlistlist(userId, wishlistlistId);
    if (!owner)
      throw new UnauthorizedException(
        'Редактировать можно только свой список  желаний',
      );

    if (!wishlistlist) throw new NotFoundException('Список  желаний не найден');

    const { itemsId, ...rest } = updateWishlistlistDto;

    if (!itemsId) {
      return await this.wishlistlistRepository.save({
        ...wishlistlist,
        ...updateWishlistlistDto,
      });
    }

    const wishes = await this.wishService.findWishes(itemsId);

    return await this.wishlistlistRepository.save({
      ...rest,
      ...wishlistlist,
      items: wishes,
    });
  }

  async remove(userId: number, wishlistlistId: number) {
    const owner = await this.usersService.findUser({ where: { id: userId } });

    if (!owner) throw new UnauthorizedException('Необхоодима авторизация');

    return this.wishlistlistRepository.delete(wishlistlistId);
  }
}
