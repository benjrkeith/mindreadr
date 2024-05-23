import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Request } from 'express'

import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest()
    const userId = req.user['id']

    let targetId: number
    let target: { authorId: number }

    if (req.params.commentId) {
      targetId = Number(req.params.commentId)
      target = await this.prisma.comment.findUnique({
        where: { id: targetId },
        select: { authorId: true },
      })
    } else {
      targetId = Number(req.params.postId)
      target = await this.prisma.post.findUnique({
        where: { id: targetId },
        select: { authorId: true },
      })
    }

    if (!target) throw new NotFoundException('Resource not found')

    return target.authorId === userId
  }
}
