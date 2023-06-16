import { IsEmail, MinLength, IsString, IsPhoneNumber } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  @IsString()
  password: string;
}

export class AuthRegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsPhoneNumber()
  @IsString()
  phone: string;

  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  @IsString()
  password: string;
}
