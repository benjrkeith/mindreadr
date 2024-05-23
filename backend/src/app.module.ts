import { Module } from '@nestjs/common'

import { AuthModule } from 'src/auth/auth.module'
import { PostModule } from 'src/post/post.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { UserModule } from 'src/user/user.module'
import { ChatModule } from 'src/chat/chat.module'
import { NotificationModule } from 'src/notification/notification.module'

@Module({
  imports: [
    AuthModule,
    PostModule,
    UserModule,
    PrismaModule,
    ChatModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
