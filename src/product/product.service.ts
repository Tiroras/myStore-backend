import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { productObj, productObjFullest } from './product.object';
import {
  EnumProductSort,
  GetAllFoundProductDto,
  GetAllProductDto,
  ProductDto,
} from './product.dto';
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

  async getProduct(where: Prisma.ProductWhereUniqueInput) {
    const product = await this.prisma.product.findUnique({
      where,
      select: productObjFullest,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async getProducts(delegate?: Prisma.ProductFindManyArgs) {
    const products = await this.prisma.product.findMany(delegate);

    if (!products) throw new NotFoundException('Products not found');

    return {
      products,
      length: await this.getCount(delegate.where),
    };
  }

  async byId(id: number) {
    return await this.getProduct({
      id,
    });
  }

  async bySlug(slug: string) {
    return await this.getProduct({
      slug,
    });
  }

  async getAll(dto: GetAllFoundProductDto = {}) {
    const { sort, searchTerm } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] =
      this.getSort(sort);

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

    const data = await this.getProducts({
      skip,
      take: perPage,
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      select: productObj,
    });

    return data;
  }

  async getAllByCategory(categorySlug: string, dto: GetAllProductDto) {
    const where = {
      category: {
        slug: categorySlug,
      },
    };

    const { perPage, skip } = this.paginationService.getPagination(dto);
    const prismaSort = this.getSort(dto.sort);

    const data = await this.getProducts({
      skip,
      take: perPage,
      where,
      select: productObjFullest,
      orderBy: prismaSort,
    });

    return data;
  }

  async getSimiliar(id: number) {
    const currentProduct = await this.byId(id);

    if (!currentProduct)
      throw new NotFoundException('Current product not found');

    const where = {
      category: {
        name: currentProduct.category.name,
      },
      NOT: {
        id: currentProduct.id,
      },
    };

    const data = this.getProducts({
      where,
      orderBy: {
        createAt: 'desc',
      },
      select: productObj,
    });

    return data;
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

  async getCount(where: Prisma.ProductWhereInput) {
    return await this.prisma.product.count({ where });
  }

  getSort(sort: EnumProductSort) {
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

    return prismaSort;
  }
}
