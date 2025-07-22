import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const getUserDecoratorFactory = (
  data: string | undefined,
  ctx: ExecutionContext,
) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const user = request['user'];

  if (!user) return undefined;
  if (!data) return user;

  return user[data];
};

export const GetUser = createParamDecorator(getUserDecoratorFactory);
