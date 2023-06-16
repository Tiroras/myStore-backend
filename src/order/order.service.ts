import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from './order.dto';
import { productObj } from 'src/product/product.object';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: number) {
    return await this.prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createAt: 'desc',
      },
      include: {
        items: {
          include: {
            product: {
              select: productObj,
            },
          },
        },
      },
    });
  }

  async placeOrder(dto: OrderDto, userId: number) {
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: dto.items.map(item => item.productId) },
      },
    });

    if (!products || products.length !== dto.items.length) {
      throw new NotFoundException('Products not found');
    }

    const order = await this.prisma.order.create({
      data: {
        status: dto.status,
        items: {
          create: dto.items,
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return order;
  }
}
