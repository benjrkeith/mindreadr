import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'
import { CreatePostDto } from 'src/post/dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  getComments(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
    })
  }

  async createComment(postId: number, userId: number, dto: CreatePostDto) {
    try {
      return await this.prisma.comment.create({
        data: { ...dto, postId, authorId: userId },
      })
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2003') throw new NotFoundException('Post not found')
        else throw e
      } else throw e
    }
  }

  updateComment(commentId: number, dto: CreatePostDto) {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: dto,
    })
  }

  deleteComment(commentId: number) {
    return this.prisma.comment.delete({
      where: { id: commentId },
    })
  }
}
