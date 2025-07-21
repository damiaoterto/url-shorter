import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Match } from '../decorators/match.decorator';

export class RegisterUserDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(3, 180)
  name: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(3, 120)
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(8, 120)
  password: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(8, 120)
  @Match('password')
  passwordConfirm: string;
}
