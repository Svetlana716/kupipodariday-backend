import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @Length(2, 200)
  @IsOptional()
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8, { message: 'Пароль должен быть больше чем 8 символов' })
  @IsNotEmpty()
  password: string;
}
