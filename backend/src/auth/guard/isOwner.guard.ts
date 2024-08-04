import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'
import { RequestWithUser } from 'src/ReqWithUser'

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: RequestWithUser = context.switchToHttp().getRequest()
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
