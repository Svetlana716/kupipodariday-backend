import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';

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
      throw new BadRequestException('Нельзя поддержать свои подарки');

    if (raised > wish.price)
      throw new BadRequestException('Сумма заявки больше чем осталось собрать');

    await this.wishService.changeWish(itemId, { raised });

    return this.offerRepository.save({
      hidden,
      amount,
      user: owner,
      item: wish,
    });
  }

  /* async findOffer(query: FindOneOptions<Offer>) {
    return this.offerRepository.findOneOrFail(query);
  } */

  async findOffers(userId: number) {
    const owner = await this.usersService.findUser({
      where: { id: userId },
      relations: {
        offers: {
          item: {
            owner: true,
            offers: true,
          },
          user: true,
        },
      },
    });
    return owner.offers || [];
  }

  async findOffer(userId: number, offerId: number) {
    const offers = await this.findOffers(userId);
    return offers.find(el => el.id === +offerId);
  }
}
