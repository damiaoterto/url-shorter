import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class LoginUserDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(120)
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  password: string;
}
