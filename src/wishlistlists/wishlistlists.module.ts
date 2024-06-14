import { Module } from '@nestjs/common';
import { WishlistlistsService } from './wishlistlists.service';
import { WishlistlistsController } from './wishlistlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlistlist } from './entities/wishlistlists.entity';
import { UsersModule } from 'src/users/users.module';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlistlist]),
    WishesModule,
    UsersModule,
  ],
  controllers: [WishlistlistsController],
  providers: [WishlistlistsService],
})
export class WishlistlistsModule {}
