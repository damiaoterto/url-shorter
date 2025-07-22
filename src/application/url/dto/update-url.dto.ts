import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUrlDTO {
  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;
}
