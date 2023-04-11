import { Prisma } from '@prisma/client';
import { userObj } from 'src/user/return-user.object';

export const reviewObject: Prisma.ReviewSelect = {
  id: true,
  rating: true,
  text: true,
  createAt: true,
  user: {
    select: userObj,
  },
};
