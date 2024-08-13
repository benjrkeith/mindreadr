import { Module } from '@nestjs/common'
import { NotificationController } from 'src/notification/notification.controller'
import { NotificationService } from 'src/notification/notification.service'

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
