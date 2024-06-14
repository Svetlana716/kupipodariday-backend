import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistlistsService } from './wishlistlists.service';
import { CreateWishlistlistDto } from './dto/create-wishlistlist.dto';
import { UpdateWishlistlistDto } from './dto/update-wishlistlist.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/decorators/auth.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('wishlistlists')
export class WishlistlistsController {
  constructor(private readonly wishlistlistsService: WishlistlistsService) {}

  @Get()
  async findAll() {
    return await this.wishlistlistsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createWishlistDto: CreateWishlistlistDto,
    @AuthUser() user: User,
  ) {
    return await this.wishlistlistsService.create(createWishlistDto, user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@AuthUser() user: User, @Param('id') wishlistlistId: string) {
    return await this.wishlistlistsService.findWishlistlist(
      user.id,
      +wishlistlistId,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @AuthUser() user: User,
    @Param('id') wishlistlistId: string,
    @Body() updateWishlistDto: UpdateWishlistlistDto,
  ) {
    return await this.wishlistlistsService.update(
      user.id,
      +wishlistlistId,
      updateWishlistDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@AuthUser() user: User, @Param('id') wishlistId: string) {
    return await this.wishlistlistsService.remove(user.id, +wishlistId);
  }
}
