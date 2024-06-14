import { Exclude } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlistlist } from 'src/wishlistlists/entities/wishlistlists.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  @IsEmpty()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  @IsEmpty()
  updatedAt: Date;

  @Column({ unique: true })
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsOptional()
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsOptional()
  avatar: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Exclude()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @OneToMany(() => Wish, wish => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, offer => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlistlist, wishlistlist => wishlistlist.owner)
  wishlists: Wishlistlist[];
}
