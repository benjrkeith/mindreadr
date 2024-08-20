import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'

import { GetUser } from 'src/auth/decorator'
import { IsAdminOrOwnerGuard, IsOwnerGuard, JwtGuard } from 'src/auth/guard'
import { CreatePostDto, UpdatePostDto } from 'src/post/dto'
import { PostService } from 'src/post/post.service'

@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getPosts(
    @GetUser('id') userId: number,
    @Query('author') author: string,
    @Query('following', new DefaultValuePipe(false), ParseBoolPipe)
    onlyFollowing: boolean,
  ) {
    return await this.postService.getPosts(userId, onlyFollowing, author)
  }

  @Get(':postId')
  async getPost(
    @GetUser('id') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    const post = await this.postService.getPost(userId, postId)

    if (post === null) throw new NotFoundException('Post not found')

    return post
  }

  @Post()
  async createPost(@GetUser('id') userId: number, @Body() dto: CreatePostDto) {
    return await this.postService.createPost(userId, dto)
  }

  @UseGuards(IsOwnerGuard)
  @Patch(':postId')
  async updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: UpdatePostDto,
  ) {
    return await this.postService.updatePost(postId, dto)
  }

  @UseGuards(IsAdminOrOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':postId')
  async deletePost(@Param('postId', ParseIntPipe) postId: number) {
    await this.postService.deletePost(postId)
  }
}
