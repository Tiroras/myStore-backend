import { Prisma } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/pagination/pagination.dto';

export class ProductDto implements Prisma.ProductUpdateInput {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  categoryId: number;

  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  images: string[];
}

export enum EnumProductSort {
  HIGH_PRICE = 'high-price',
  LOW_PRICE = 'low-price',
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class GetAllProductDto extends PaginationDto {
  @IsOptional()
  @IsEnum(EnumProductSort)
  sort?: EnumProductSort;

  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsString()
  perPage?: string;

  @IsString()
  page?: string;
}
