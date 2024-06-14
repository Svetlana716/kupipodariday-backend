import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { WishesModule } from './wishes/wishes.module';
import { WishlistlistsModule } from './wishlistlists/wishlistlists.module';
import { OffersModule } from './offers/offers.module';
import config from './config/configuration';
import { DatabaseConfigFactory } from './config/database-config.factory';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigFactory,
    }),
    AuthModule,
    UsersModule,
    WishesModule,
    WishlistlistsModule,
    OffersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
