import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetAllProductDto, ProductDto } from './product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  createProduct() {
    return this.productService.createProduct();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  updateProduct(@Param('id') productId: string, @Body() dto: ProductDto) {
    return this.productService.updateProduct(+productId, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(+id);
  }

  @Auth()
  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productService.byId(+id);
  }

  @Auth()
  @Get('by-slug/:slug')
  getProductBySlug(@Param('slug') slug: string) {
    return this.productService.bySlug(slug);
  }

  @UsePipes(new ValidationPipe())
  @Get()
  getProducts(@Query() dto: GetAllProductDto) {
    return this.productService.getAll(dto);
  }

  @Get('by-category/:slug')
  getProductByCategory(@Param('slug') slug: string) {
    return this.productService.getAllByCategory(slug);
  }

  @Get('similar/:id')
  getSimilarProducts(@Param('id') productId: string) {
    return this.productService.getSimiliar(+productId);
  }
}
