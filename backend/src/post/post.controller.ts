import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import { GetUser } from 'src/auth/decorator'
import { IsAdminOrOwnerGuard, IsOwnerGuard, JwtGuard } from 'src/auth/guard'
import { CreatePostDto, UpdatePostDto } from 'src/post/dto'
import { PostService } from 'src/post/post.service'

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getPosts() {
    return await this.postService.getPosts()
  }

  @Get(':postId')
  async getPost(@Param('postId', ParseIntPipe) postId: number) {
    const post = await this.postService.getPost(postId)

    if (post === null) throw new NotFoundException('Post not found')

    return post
  }

  @UseGuards(JwtGuard)
  @Post()
  async createPost(@GetUser('id') userId: number, @Body() dto: CreatePostDto) {
    return await this.postService.createPost(userId, dto)
  }

  @UseGuards(JwtGuard, IsOwnerGuard)
  @Patch(':postId')
  async updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: UpdatePostDto,
  ) {
    return await this.postService.updatePost(postId, dto)
  }

  @UseGuards(JwtGuard, IsAdminOrOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':postId')
  async deletePost(@Param('postId', ParseIntPipe) postId: number) {
    await this.postService.deletePost(postId)
  }
}
