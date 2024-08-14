import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { EditUserDto } from 'src/user/dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { S3Service } from 'src/S3/S3.service'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private s3Service: S3Service,
  ) {}

  getAllUsernames() {
    return this.prismaService.user.findMany({
      select: { username: true, avatar: true, id: true },
    })
  }

  getUser(username: string) {
    return this.prismaService.user.findUnique({
      where: { username },
      omit: { password: true },
      include: {
        _count: {
          select: { followers: true, following: true, posts: true },
        },
      },
    })
  }

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: dto,
      omit: { password: true },
    })

    return user
  }

  async uploadAvatar(file: Express.Multer.File, username: string) {
    const res = await this.s3Service.upload(file, `${username}_avatar`)

    await this.prismaService.user.update({
      where: { username },
      data: { avatar: res.url },
    })

    return res
  }

  async uploadCover(file: Express.Multer.File, username: string) {
    const res = await this.s3Service.upload(file, `${username}_cover`)

    await this.prismaService.user.update({
      where: { username },
      data: { cover: res.url },
    })

    return res
  }

  async followUser(userId: number, targetId: number) {
    try {
      return await this.prismaService.followers.create({
        data: {
          user: { connect: { id: targetId } },
          follower: { connect: { id: userId } },
        },
      })
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException('You are already following this user')
        } else if (e.code === 'P2025') {
          throw new NotFoundException('That user does not exist')
        }
      } else throw e
    }
  }

  async unFollowUser(userId: number, targetId: number) {
    try {
      await this.prismaService.followers.delete({
        where: {
          userId_followerId: {
            userId: targetId,
            followerId: userId,
          },
        },
      })
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('You are not following this user')
        }
      } else throw e
    }
  }
}
