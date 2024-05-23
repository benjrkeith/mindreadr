import { Injectable } from '@nestjs/common'

import { CreatePostDto, UpdatePostDto } from 'src/post/dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  getPosts() {
    return this.prisma.post.findMany()
  }

  getPost(postId: number) {
    return this.prisma.post.findUnique({
      where: { id: postId },
    })
  }

  createPost(userId: number, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...dto,
        authorId: userId,
      },
    })
  }

  updatePost(postId: number, dto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id: postId },
      data: dto,
    })
  }

  deletePost(postId: number) {
    return this.prisma.post.delete({
      where: { id: postId },
    })
  }
}
