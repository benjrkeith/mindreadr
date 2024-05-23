import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

import { PrismaService } from 'src/prisma/prisma.service'
import { CreateChatDto, UpdateChatDto } from 'src/chat/dto'

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {}

  getChats(userId: number) {
    return this.prismaService.chat.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        messages: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    })
  }

  async getChat(userId: number, chatId: number) {
    const chat = await this.prismaService.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 12,
        },
      },
    })

    if (!chat) throw new NotFoundException('Chat not found')
    else return chat
  }

  async createChat(dto: CreateChatDto) {
    try {
      return await this.prismaService.chat.create({
        data: {
          name: dto.name,
          members: {
            create: dto.users.map((userId) => ({ userId })),
          },
        },
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2003')
          throw new NotFoundException('User not found')
      throw error
    }
  }

  async updateChat(chatId: number, dto: UpdateChatDto) {
    try {
      return await this.prismaService.chat.update({
        where: {
          id: chatId,
        },
        data: {
          name: dto.name,
          members: {
            create: dto.addUsers.map((userId) => ({ userId })),
            delete: dto.removeUsers.map((userId) => ({
              chatId_userId: { userId, chatId },
            })),
          },
        },
        include: {
          members: true,
        },
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2002')
          throw new ConflictException('User already in chat')
        else if (['P2003', 'P2017'].includes(error.code))
          throw new NotFoundException('User not found')
        else if (error.code === 'P2025')
          throw new NotFoundException('Chat not found')
      throw error
    }
  }

  deleteChat(chatId: number) {
    return this.prismaService.chat.delete({
      where: {
        id: chatId,
      },
    })
  }
}
