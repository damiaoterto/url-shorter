import { Controller, Get, Param, Res } from '@nestjs/common';
import { Public } from '../decorators/is-public.decorator';
import { AccessUrlUseCase } from '@application/url/usecases/access-url.usecase';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly accessUrlUseCase: AccessUrlUseCase) {}

  @Get(':shortCode')
  @Public()
  async redirect(@Res() res: Response, @Param('shortCode') code: string) {
    const url = await this.accessUrlUseCase.execute(code);
    return res.redirect(302, url.originalUrl);
  }
}
