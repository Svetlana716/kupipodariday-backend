import { IsNotEmpty, IsUrl, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
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
export class Wishlistlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @Column({ default: 'Пока ничего не описано' })
  @IsNotEmpty()
  @Length(1, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, user => user.wishlists, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @OneToMany(() => Wish, wish => wish.wishlist, {
    onDelete: 'CASCADE',
  })
  items: Wish[];
}
