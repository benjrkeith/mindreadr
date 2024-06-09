import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateMessageDto } from 'src/chat/dto'

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}

  async getMessages(
    userId: number,
    chatId: number,
    skip: number = 0,
    take: number = 12,
  ) {
    const findQuery = this.prismaService.message.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      skip,
      take,
    })

    const updateQuery = this.prismaService.chatMember.update({
      data: {
        isRead: true,
      },
      where: {
        chatId_userId: {
          chatId,
          userId,
        },
      },
    })

    const result = await this.prismaService.$transaction([
      findQuery,
      updateQuery,
    ])
    return result[0]
  }

  async createMessage(chatId: number, userId: number, dto: CreateMessageDto) {
    const updateQuery = this.prismaService.chat.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: chatId,
      },
    })
    const createQuery = this.prismaService.message.create({
      data: {
        chatId,
        authorId: userId,
        ...dto,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    })

    const result = await this.prismaService.$transaction([
      updateQuery,
      createQuery,
    ])

    return result[1]
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
