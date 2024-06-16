import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import {
  userSelectOptions,
  offerSelectOptions,
  wishSelectOptions,
  relations,
} from 'src/helpers/constants';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const { amount, itemId, hidden } = createOfferDto;

    const owner = await this.usersService.findUser({ where: { id: userId } });
    const wish = await this.wishService.findWish(itemId);
    const raised = (wish.raised += amount);

    if (owner.id === wish.owner.id)
      throw new ForbiddenException('Нельзя поддержать свои подарки');

    if (wish.raised === wish.price) {
      throw new ForbiddenException('Необходимая сумма собрана');
    }

    if (raised > wish.price)
      throw new ForbiddenException('Сумма заявки больше чем осталось собрать');

    await this.wishService.changeWish(itemId, { raised });

    const offer = this.offerRepository.create({
      hidden,
      amount,
      user: owner,
      item: wish,
    });

    return await this.offerRepository.save(offer);
  }

  async findOffers(userId: number) {
    const owner = await this.usersService.findUser({
      select: {
        ...userSelectOptions,
        offers: {
          ...offerSelectOptions,
          user: { ...userSelectOptions },
          item: {
            ...wishSelectOptions,
            owner: { ...userSelectOptions },
          },
        },
      },
      where: { id: userId },
      relations: {
        offers: {
          item: true,
          ...relations,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return owner.offers || [];
  }

  async findOffer(userId: number, offerId: number) {
    const offers = await this.findOffers(userId);
    return offers.find(el => el.id === +offerId);
  }
}
