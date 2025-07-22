import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateNewUrlDTO } from '@application/url/dto/create-new-url.dto';
import { CreateNewUrlUseCase } from '@application/url/usecases/create-new-url.usecase';
import { Public } from '../decorators/is-public.decorator';
import { GetUser } from '../decorators/get-user.decorator';
import { DeleteUrlUseCase } from '@application/url/usecases/delete-url.usecase';
import { UpdateUrlDTO } from '@application/url/dto/update-url.dto';
import { UpdateUrlUseCase } from '@application/url/usecases/update-url.usecase';

@Controller({ path: 'url', version: '1' })
export class UrlController {
  constructor(
    private readonly createNewUrlUseCase: CreateNewUrlUseCase,
    private readonly updateUrlUseCase: UpdateUrlUseCase,
    private readonly deleteUrlUseCase: DeleteUrlUseCase,
  ) {}

  @Post()
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() data: CreateNewUrlDTO,
    @GetUser() userData: { email?: string },
  ) {
    return await this.createNewUrlUseCase.execute({ ...data, ...userData });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUrlDTO,
    @GetUser('email') email: string,
  ) {
    return await this.updateUrlUseCase.execute({ ...data, id, email });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async delete(@Param('id') id: string, @GetUser('email') email: string) {
    return await this.deleteUrlUseCase.execute({ id, email });
  }
}
