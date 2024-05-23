import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import { CommentService } from 'src/post/comment/comment.service'
import { CreatePostDto } from 'src/post/dto'
import { GetUser } from 'src/auth/decorator'
import { JwtGuard, IsOwnerGuard, IsAdminOrOwnerGuard } from 'src/auth/guard'

@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  async getComments(@Param('postId', ParseIntPipe) postId: number) {
    return await this.commentService.getComments(postId)
  }

  @UseGuards(JwtGuard)
  @Post()
  async createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser('id') userId: number,
    @Body() dto: CreatePostDto,
  ) {
    return await this.commentService.createComment(postId, userId, dto)
  }

  @UseGuards(JwtGuard, IsOwnerGuard)
  @Patch(':commentId')
  async updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: CreatePostDto,
  ) {
    return await this.commentService.updateComment(commentId, dto)
  }

  @UseGuards(JwtGuard, IsAdminOrOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':commentId')
  async deleteComment(@Param('commentId', ParseIntPipe) commentId: number) {
    await this.commentService.deleteComment(commentId)
  }
}
