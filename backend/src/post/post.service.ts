import { Injectable } from '@nestjs/common'

import { CreatePostDto, UpdatePostDto } from 'src/post/dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getPosts(userId: number, onlyFollowing: boolean, author?: string) {
    let authors = []
    if (author) {
      authors = [author]
    } else if (onlyFollowing) {
      const following = await this.prisma.user
        .findUnique({
          where: { id: userId },
        })
        .following({
          select: {
            user: { select: { username: true } },
          },
        })

      authors = following.map((u) => u.user.username)
    }

    return await this.prisma.post.findMany({
      where: {
        ...(authors.length > 0
          ? { author: { username: { in: authors } } }
          : {}),
      },
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
      omit: { authorId: true },
      orderBy: { createdAt: 'asc' },
    })
  }

  getPost(userId: number, postId: number) {
    return this.prisma.post.findUnique({
      where: { id: postId },
      omit: { authorId: true },
      include: {
        likes: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        comments: {
          select: {
            content: true,
            id: true,
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
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
