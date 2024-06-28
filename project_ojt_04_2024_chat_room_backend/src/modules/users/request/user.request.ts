import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class userLoginDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(20)
  password: string;
}

export class createUserDto {
  @IsEmail({})
  @MaxLength(30)
  email: string;

  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  birthDate: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  role: number;

  avatar: string;
}
