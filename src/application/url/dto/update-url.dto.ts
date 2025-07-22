import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUrlDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;
}
