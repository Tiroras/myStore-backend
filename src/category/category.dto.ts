import { IsOptional, IsString } from 'class-validator';

export class CategoryDto {
  @IsOptional()
  @IsString()
  name: string;
}
