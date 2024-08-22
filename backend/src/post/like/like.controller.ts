import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'

import { GetUser } from 'src/auth/decorator'
import { JwtGuard } from 'src/auth/guard'
import { LikeService } from 'src/post/like/like.service'

@UseGuards(JwtGuard)
@Controller('posts/:postId/likes')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post()
  async createLike(
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser('id') userId: number,
  ) {
    return await this.likeService.createLike(postId, userId)
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLike(
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser('id') userId: number,
  ) {
    return await this.likeService.deleteLike(postId, userId)
  }
}
