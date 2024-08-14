import { Module } from '@nestjs/common'

import { PostController } from 'src/post/post.controller'
import { PostService } from 'src/post/post.service'
import { IsAdminGuard, IsOwnerGuard } from 'src/auth/guard'
import { CommentController } from 'src/post/comment/comment.controller'
import { CommentService } from 'src/post/comment/comment.service'
import { LikeController } from 'src/post/like/like.controller'
import { LikeService } from 'src/post/like/like.service'

@Module({
  controllers: [PostController, CommentController, LikeController],
  providers: [
    PostService,
    CommentService,
    LikeService,
    IsAdminGuard,
    IsOwnerGuard,
  ],
})
export class PostModule {}
