import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateWishlistlistDto {
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @Length(1, 1500)
  @IsOptional()
  description: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
