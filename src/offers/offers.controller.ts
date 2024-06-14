import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthUser } from 'src/common/decorators/auth.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Offer } from './entities/offer.entity';

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Body() createOfferDto: CreateOfferDto, @AuthUser() user: User) {
    return await this.offersService.create(createOfferDto, user.id);
  }

  @Get()
  async findAll(@AuthUser() user: User): Promise<Offer[]> {
    return await this.offersService.findOffers(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') offerId: number, @AuthUser() user: User) {
    return await this.offersService.findOffer(user.id, offerId);
  }
}
