import { Module } from '@nestjs/common'

import { NotificationModule } from 'src/notification/notification.module'
import { S3Service } from 'src/S3/S3.service'
import { UserController } from 'src/user/user.controller'
import { UserService } from 'src/user/user.service'

@Module({
  imports: [NotificationModule],
  controllers: [UserController],
  providers: [UserService, S3Service],
})
export class UserModule {}
