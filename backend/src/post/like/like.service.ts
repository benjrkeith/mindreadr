import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async createLike(postId: number, userId: number) {
    try {
      return await this.prisma.like.create({
        data: {
          post: { connect: { id: postId } },
          user: { connect: { id: userId } },
        },
      })
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new ConflictException('You have already liked this post')
        else if (e.code === 'P2025')
          throw new NotFoundException('Post not found')
      } else throw e
    }
  }

  async deleteLike(postId: number, userId: number) {
    try {
      return await this.prisma.like.delete({
        where: {
          userId_postId: { postId, userId },
        },
      })
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new NotFoundException('Like not found')
      } else throw e
    }
  }
}
