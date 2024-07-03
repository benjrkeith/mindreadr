import { Injectable } from '@nestjs/common'

import { EditUserDto } from 'src/user/dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { S3Service } from 'src/S3/S3.service'

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
      select: { username: true, avatar: true, id: true, cover: true },
    })
  }

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: dto,
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
}
