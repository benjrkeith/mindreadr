import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import { GetUser } from 'src/auth/decorator'
import { JwtGuard } from 'src/auth/guard'
import { ChatService } from 'src/chat/service'
import { CreateChatDto, UpdateChatDto } from 'src/chat/dto'
import { DoesChatExist, IsChatMember } from 'src/chat/guard'
import { NotificationService } from 'src/notification/notification.service'

@UseGuards(JwtGuard)
@Controller('chats')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private notificationService: NotificationService,
  ) {}

  @Get()
  async getChats(@GetUser('id') userId: number) {
    return await this.chatService.getChats(userId)
  }

  @UseGuards(DoesChatExist, IsChatMember)
  @Get(':chatId')
  async getChat(
    @GetUser('id') userId: number,
    @Param('chatId', ParseIntPipe) chatId: number,
  ) {
    return await this.chatService.getChat(userId, chatId)
  }

  @Post()
  async createChat(@GetUser('id') userId: number, @Body() dto: CreateChatDto) {
    if (dto.users.includes(userId)) {
      if (dto.users.length === 1)
        throw new BadRequestException(
          'Cannot create a chat without other users',
        )
    } else dto.users.push(userId)

    for (const user of dto.users) {
      if (user === userId) continue

      const notification = await this.notificationService.createNotification(
        user,
        userId,
        '1000',
      )
      this.notificationService.pushNotification(notification)
    }

    return await this.chatService.createChat(userId, dto)
  }

  @UseGuards(DoesChatExist, IsChatMember)
  @Patch(':chatId')
  async updateChat(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() dto: UpdateChatDto,
  ) {
    if (dto.addUsers.length === 0 && dto.removeUsers.length === 0 && !dto.name)
      throw new BadRequestException('At least one field must be provided')
    return await this.chatService.updateChat(chatId, dto)
  }

  @UseGuards(DoesChatExist, IsChatMember)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':chatId')
  async deleteChat(@Param('chatId', ParseIntPipe) chatId: number) {
    await this.chatService.deleteChat(chatId)
  }
}
