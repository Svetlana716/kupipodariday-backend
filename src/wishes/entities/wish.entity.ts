import { IsPositive, IsUrl, Length } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wishlistlist } from 'src/wishlistlists/entities/wishlistlists.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsPositive()
  price: number;

  @Column({ default: 0 })
  @IsPositive()
  raised: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column({ default: 0 })
  @IsPositive()
  copied: number;

  @ManyToOne(() => User, user => user.wishes, {
    onDelete: 'CASCADE',
  })
  @IsUrl()
  owner: User;

  @OneToMany(() => Offer, offer => offer.item, {
    onDelete: 'CASCADE',
  })
  @IsUrl()
  offers: Offer[];

  @ManyToOne(() => Wishlistlist, wishlist => wishlist.items, {
    onDelete: 'CASCADE',
  })
  wishlist: Wishlistlist;
}
