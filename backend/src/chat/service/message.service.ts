import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateMessageDto } from 'src/chat/dto'

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}

  getMessages(chatId: number, skip: number = 0, take: number = 12) {
    return this.prismaService.message.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    })
  }

  createMessage(chatId: number, userId: number, dto: CreateMessageDto) {
    return this.prismaService.message.create({
      data: {
        chatId,
        authorId: userId,
        ...dto,
      },
    })
  }

  editMessage(chatId: number, messageId: number, dto: CreateMessageDto) {
    return this.prismaService.message.update({
      where: {
        id: messageId,
        chatId,
      },
      data: dto,
    })
  }

  deleteMessage(chatId: number, messageId: number) {
    return this.prismaService.message.delete({
      where: {
        id: messageId,
        chatId,
      },
    })
  }
}
