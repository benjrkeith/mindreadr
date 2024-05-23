import {
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
  Query,
  UseGuards,
} from '@nestjs/common'

import { GetUser } from 'src/auth/decorator'
import { JwtGuard } from 'src/auth/guard'
import { MessageService } from 'src/chat/service'
import { CreateMessageDto, QueryDto } from 'src/chat/dto'
import { IsChatMember, IsMessageOwnerGuard } from 'src/chat/guard'

@UseGuards(JwtGuard, IsChatMember)
@Controller('chats/:chatId/messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get()
  async getMessages(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Query() query: QueryDto,
  ) {
    return await this.messageService.getMessages(chatId, query.skip, query.take)
  }

  getMessage() {}

  @Post()
  async createMessage(
    @Param('chatId', ParseIntPipe) chatId: number,
    @GetUser('id') userId: number,
    @Body() dto: CreateMessageDto,
  ) {
    return await this.messageService.createMessage(chatId, userId, dto)
  }

  @UseGuards(IsMessageOwnerGuard)
  @Patch(':messageId')
  async updateMessage(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
    @Body() dto: CreateMessageDto,
  ) {
    return await this.messageService.editMessage(chatId, messageId, dto)
  }

  @UseGuards(IsMessageOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':messageId')
  async deleteMessage(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    return await this.messageService.deleteMessage(chatId, messageId)
  }
}
