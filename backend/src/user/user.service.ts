import { Injectable } from '@nestjs/common'

import { EditUserDto } from 'src/user/dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getAllUsernames() {
    return this.prisma.user.findMany({
      select: { username: true, avatar: true, id: true },
    })
  }

  getUser(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: { username: true, avatar: true, id: true },
    })
  }

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    })

    return user
  }
}
