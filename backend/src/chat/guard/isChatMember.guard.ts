import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'
import { RequestWithUser } from 'src/ReqWithUser'

@Injectable()
export class IsChatMember implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: RequestWithUser = context.switchToHttp().getRequest()
    const userId = req.user['id']
    const chatId = Number(req.params.chatId)

    const chatMember = await this.prismaService.chatMember.findUnique({
      where: {
        chatId_userId: {
          chatId: chatId,
          userId: userId,
        },
      },
    })

    return Boolean(chatMember)
  }
}
