import {
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ReviewDto } from './review.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Auth()
  @Post('leave/:productId')
  @HttpCode(200)
  createReview(
    @CurrentUser('id') id: number,
    @Body() dto: ReviewDto,
    @Param('productId') productId: string,
  ) {
    return this.reviewService.createReview(id, dto, +productId);
  }

  @Get()
  getReviews() {
    return this.reviewService.getAll();
  }
}
