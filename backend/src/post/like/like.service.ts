import { Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  createLike(postId: number, userId: number) {
    return this.prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    })
  }

  deleteLike(postId: number, userId: number) {
    return this.prisma.like.delete({
      where: {
        userId_postId: { postId, userId },
      },
    })
  }
}
