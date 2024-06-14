import { ConflictException } from '@nestjs/common';

export async function isUserExist(email: string, username: string) {
  const existUser = await this.userRepository.findOne({
    where: [{ email }, { username }],
  });
  if (existUser)
    throw new ConflictException(
      'Пользователь с таким email или username уже зарегистрирован',
    );
}
