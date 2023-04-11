import {
  Controller,
  Get,
  Put,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') userId: number) {
    return this.userService.byId(userId);
  }

  @Auth()
  @HttpCode(200)
  @Patch('profile/favorites/:productId')
  toggleFavorites(
    @Param('productId') productId: string,
    @CurrentUser('id') userId: number,
  ) {
    return this.userService.toggleFavorites(+productId, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('profile')
  @Auth()
  updateProfile(@CurrentUser('id') userId: number, @Body() dto: UserDto) {
    return this.userService.updateProfile(userId, dto);
  }
}
