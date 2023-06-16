import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import { userObj } from './return-user.object';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';
import { productObjFullest } from 'src/product/product.object';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async byId(userId: number, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        ...userObj,
        favorites: {
          select: {
            ...productObjFullest,
            category: {
              select: {
                slug: true,
              },
            },
          },
        },
        reviews: true,
        ...selectObject,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateProfile(userId: number, dto: UserDto) {
    const isSameUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (isSameUser && userId !== isSameUser.id)
      throw new BadRequestException('Email already exists');

    const user = await this.byId(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        email: dto.email,
        name: dto.name,
        avatarPath: dto.avatarPath,
        phone: dto.phone,
        password: dto.password ? await hash(dto.password) : user.password,
      },
    });
  }

  async toggleFavorites(productId: number, userId: number) {
    const user = await this.byId(userId);
    if (!user) throw new NotFoundException('User not found!');

    const isExists = user.favorites.some(prod => prod.id === productId);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favorites: {
          [isExists ? 'disconnect' : 'connect']: {
            id: productId,
          },
        },
      },
    });

    return 'Success';
  }
}
