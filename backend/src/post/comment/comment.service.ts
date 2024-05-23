import { Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'
import { CreatePostDto } from 'src/post/dto'

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  getComments(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
    })
  }

  createComment(postId: number, userId: number, dto: CreatePostDto) {
    return this.prisma.comment.create({
      data: { ...dto, postId, authorId: userId },
    })
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
