import { PartialType } from '@nestjs/mapped-types';
import { CreateWishlistlistDto } from './create-wishlistlist.dto';

export class UpdateWishlistlistDto extends PartialType(CreateWishlistlistDto) {}
