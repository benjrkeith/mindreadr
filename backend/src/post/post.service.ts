import { Injectable } from '@nestjs/common'

import { CreatePostDto, UpdatePostDto } from 'src/post/dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  getPosts(userId: number) {
    return this.prisma.post.findMany({
      include: {
        likes: { where: { userId: userId } },
        comments: { where: { authorId: userId } },
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    })
  }

  getPost(userId: number, postId: number) {
    return this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        likes: {
          select: {
            user: { select: { id: true, username: true, avatar: true } },
          },
        },
        comments: {
          select: {
            content: true,
            id: true,
            author: {
              select: { id: true, username: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
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
