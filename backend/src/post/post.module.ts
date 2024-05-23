import { Module } from '@nestjs/common'

import { PostController } from 'src/post/post.controller'
import { PostService } from 'src/post/post.service'
import { IsAdminGuard, IsOwnerGuard } from 'src/auth/guard'
import { CommentController } from 'src/post/comment/comment.controller'
import { CommentService } from 'src/post/comment/comment.service'

@Module({
  controllers: [PostController, CommentController],
  providers: [PostService, CommentService, IsAdminGuard, IsOwnerGuard],
})
export class PostModule {}
