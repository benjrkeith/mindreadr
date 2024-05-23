import { Module } from '@nestjs/common'

import { NotificationModule } from 'src/notification/notification.module'
import { UserController } from 'src/user/user.controller'
import { UserService } from 'src/user/user.service'

@Module({
  imports: [NotificationModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
