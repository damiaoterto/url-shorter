import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../decorators/match.decorator';

export class RegisterUserDTO {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(3, 180)
  name: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(3, 120)
  email: string;

  @ApiProperty({ minimum: 8 })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(8, 120)
  password: string;

  @ApiProperty({ minimum: 8 })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(8, 120)
  @Match('password')
  passwordConfirm: string;
}
