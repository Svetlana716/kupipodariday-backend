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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUser } from 'src/common/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createWishDto: CreateWishDto, @AuthUser() user: User) {
    return await this.wishesService.create(createWishDto, user.id);
  }

  @Get('last')
  async findLast() {
    return await this.wishesService.findLast();
  }

  @Get('top')
  async findTop() {
    return await this.wishesService.findTop();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.wishesService.findWish(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @AuthUser() user: User,
    @Param('id') wishId: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return await this.wishesService.update(user.id, +wishId, updateWishDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') wishId: string, @AuthUser() user: User) {
    return this.wishesService.remove(user.id, +wishId);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  async copy(@AuthUser() user: User, @Param('id') wishId: string) {
    return this.wishesService.copy(user.id, +wishId);
  }
}
