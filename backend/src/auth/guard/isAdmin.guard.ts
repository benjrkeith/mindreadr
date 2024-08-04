import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { RequestWithUser } from 'src/ReqWithUser'

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: RequestWithUser = context.switchToHttp().getRequest()
    return Boolean(req.user['isAdmin'])
  }
}
