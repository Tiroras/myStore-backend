import { Prisma } from '@prisma/client';
import { categoryObject } from 'src/category/category.object';
import { reviewObject } from 'src/review/review.object';

export const productObj: Prisma.ProductSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  images: true,
  createAt: true,
  slug: true,
  reviews: {
    select: reviewObject,
  },
  category: {
    select: categoryObject,
  },
};

export const productObjFullest: Prisma.ProductSelect = {
  ...productObj,
};
