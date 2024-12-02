import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithRt } from '../../auth/types';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request || !request.user) {
      return null;
    }

    if (!data) {
      return request.user;
    }

    const userProperty = request.user[data];

    if (userProperty === undefined) {
      return null;
    }

    return userProperty;
  },
);
