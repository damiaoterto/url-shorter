import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateNewUrlDTO {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @MaxLength(200)
  url: string;
}
