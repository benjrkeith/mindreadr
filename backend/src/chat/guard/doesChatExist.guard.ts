import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Request } from 'express'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class DoesChatExist implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest()
    const chatId = Number(req.params.chatId)

    if (isNaN(chatId)) throw new BadRequestException('Chat id must be a number')

    const chat = await this.prismaService.chat.findUnique({
      where: {
        id: chatId,
      },
    })

    if (!chat) throw new NotFoundException('Chat not found')
    else return true
  }
}
