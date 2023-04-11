import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { categoryObject } from './category.object';
import { CategoryDto } from './category.dto';
import { generateSlug } from 'src/utils/generateSlug';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async byId(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
      select: categoryObject,
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async bySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        slug,
      },
      select: categoryObject,
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async getAll() {
    const categories = await this.prisma.category.findMany({
      select: categoryObject,
    });

    return categories;
  }

  async createCategory() {
    return this.prisma.category.create({
      data: {
        name: '',
        slug: '',
      },
    });
  }

  async updateCategory(id: number, dto: CategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: generateSlug(dto.name),
      },
    });
  }

  async deleteCategory(id: number) {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
