import { Module } from '@nestjs/common'

import { ChatService, MessageService } from 'src/chat/service'
import { ChatController, MessageController } from 'src/chat/controller'
import { NotificationModule } from 'src/notification/notification.module'

@Module({
  controllers: [ChatController, MessageController],
  providers: [ChatService, MessageService],
  imports: [NotificationModule],
})
export class ChatModule {}
