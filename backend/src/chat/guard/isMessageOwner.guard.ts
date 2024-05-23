import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Request } from 'express'

import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class IsMessageOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest()

    const userId = req.user['id']
    const messageId = Number(req.params.messageId)

    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { authorId: true },
    })

    if (!message) throw new NotFoundException('Resource not found')

    return message.authorId === userId
  }
}
