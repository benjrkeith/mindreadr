import { Module } from '@nestjs/common'
import { join } from 'path'
import { ServeStaticModule } from '@nestjs/serve-static'

import { AuthModule } from 'src/auth/auth.module'
import { PostModule } from 'src/post/post.module'
import { PrismaModule } from 'src/prisma/prisma.module'
import { UserModule } from 'src/user/user.module'
import { ChatModule } from 'src/chat/chat.module'
import { NotificationModule } from 'src/notification/notification.module'
import { S3Module } from 'src/S3/S3.module'

@Module({
  imports: [
    AuthModule,
    PostModule,
    UserModule,
    PrismaModule,
    ChatModule,
    NotificationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    S3Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
