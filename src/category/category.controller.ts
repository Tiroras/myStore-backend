import {
  Controller,
  Delete,
  Post,
  Put,
  Get,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CategoryDto } from './category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  createCategory() {
    return this.categoryService.createCategory();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  updateCategory(@Param('id') id: string, @Body() dto: CategoryDto) {
    return this.categoryService.updateCategory(+id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(+id);
  }

  @Get('by-slug/:slug')
  getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoryService.bySlug(slug);
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.byId(+id);
  }

  @Get()
  getAllCategories() {
    return this.categoryService.getAll();
  }
}
