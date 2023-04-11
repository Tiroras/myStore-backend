import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { productObj, productObjFullest } from './product.object';
import { EnumProductSort, GetAllProductDto, ProductDto } from './product.dto';
import { generateSlug } from 'src/utils/generateSlug';
import { PaginationService } from 'src/pagination/pagination.service';
import { Prisma } from '@prisma/client';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly categoryService: CategoryService,
  ) {}

  async byId(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      select: productObjFullest,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async bySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        slug,
      },
      select: productObjFullest,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async getAll(dto: GetAllProductDto = {}) {
    const { sort, searchTerm } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    switch (sort) {
      case EnumProductSort.LOW_PRICE:
        prismaSort.push({ price: 'asc' });
        break;
      case EnumProductSort.HIGH_PRICE:
        prismaSort.push({ price: 'desc' });
        break;
      case EnumProductSort.NEWEST:
        prismaSort.push({ price: 'desc' });
        break;
      case EnumProductSort.OLDEST:
        prismaSort.push({ price: 'asc' });
        break;
    }

    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    const { perPage, skip } = this.paginationService.getPagination(dto);

    const products = await this.prisma.product.findMany({
      skip,
      take: perPage,
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
    });

    return {
      products,
      length: await this.prisma.product.count({
        where: prismaSearchTermFilter,
      }),
    };
  }

  async getAllByCategory(categorySlug: string) {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      select: productObjFullest,
    });

    if (!products) throw new NotFoundException('Products not found');

    return products;
  }

  async createProduct() {
    const product = await this.prisma.product.create({
      data: {
        name: '',
        description: '',
        price: 0,
        slug: '',
      },
    });

    return product.id;
  }

  async updateProduct(id: number, dto: ProductDto) {
    const { description, images, price, name, categoryId } = dto;

    this.categoryService.byId(categoryId);

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        description,
        images,
        price,
        name,
        slug: generateSlug(dto.name),
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  async deleteProduct(id: number) {
    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }

  async getSimiliar(id: number) {
    const currentProduct = await this.byId(id);

    if (!currentProduct)
      throw new NotFoundException('Current product not found');

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          name: currentProduct.category.name,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createAt: 'desc',
      },
      select: productObj,
    });

    return products;
  }
}
