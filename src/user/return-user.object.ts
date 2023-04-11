import { Prisma } from '@prisma/client';

export const userObj: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  avatarPath: true,
  password: false,
  phone: true,
};

export const productObj: Prisma.ProductSelect = {
  id: true,
  name: true,
  price: true,
  images: true,
  slug: true,
};
