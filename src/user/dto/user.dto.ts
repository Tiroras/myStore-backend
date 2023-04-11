import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatarPath: string;

  @IsOptional()
  @IsPhoneNumber()
  @IsString()
  phone?: string;
}
