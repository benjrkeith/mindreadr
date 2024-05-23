import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { IsAdminGuard, IsOwnerGuard } from 'src/auth/guard'

@Injectable()
export class IsAdminOrOwnerGuard implements CanActivate {
  constructor(
    private isAdminGuard: IsAdminGuard,
    private isOwnerGuard: IsOwnerGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return (
      this.isAdminGuard.canActivate(context) ||
      (await this.isOwnerGuard.canActivate(context))
    )
  }
}
