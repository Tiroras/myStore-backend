import { Prisma } from '@prisma/client';

export const categoryObject: Prisma.CategorySelect = {
  id: true,
  name: true,
  slug: true,
};
