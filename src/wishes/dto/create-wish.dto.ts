import { IsNotEmpty, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  price: number;

  @Length(1, 1024)
  @IsNotEmpty()
  description: string;
}
