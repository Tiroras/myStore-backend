import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { reviewObject } from './review.object';
import { ReviewDto } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.review.findMany({
      orderBy: {
        createAt: 'desc',
      },
      select: reviewObject,
    });
  }

  async createReview(userId: number, dto: ReviewDto, productId: number) {
    return this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getAverageByProductId(productId: number) {
    return this.prisma.review
      .aggregate({
        where: { productId },
        _avg: { rating: true },
      })
      .then(data => data._avg);
  }
}
