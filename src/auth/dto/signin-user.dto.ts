import { IsNotEmpty, Length, MinLength } from 'class-validator';

export class SigninUserDto {
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
