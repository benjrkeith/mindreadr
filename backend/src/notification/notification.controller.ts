import { Controller, Get, Sse, UseGuards } from '@nestjs/common'
import { Subject } from 'rxjs'

import { GetUser } from 'src/auth/decorator'
import { JwtGuard } from 'src/auth/guard'
import { NotificationService } from 'src/notification/notification.service'
import { Notification } from '@prisma/client'

@UseGuards(JwtGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Sse('subscribe')
  subscribe(@GetUser('id') userId: number): Subject<{ data: Notification }> {
    return this.notificationService.subscribe(userId)
  }

  @Get()
  async getNotifications(@GetUser('id') userId: number) {
    return await this.notificationService.fetchFromDb(userId)
  }
}
