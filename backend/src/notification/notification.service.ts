import { Injectable, NotFoundException } from '@nestjs/common'
import { Subject } from 'rxjs'

import { PrismaService } from 'src/prisma/prisma.service'
import { Notification } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

@Injectable()
export class NotificationService {
  private users: Map<number, Subject<{ data: Notification }>>

  constructor(private prismaService: PrismaService) {
    this.users = new Map()
  }

  subscribe(userId: number) {
    const subject = new Subject<{ data: Notification }>()
    this.users.set(userId, subject)
    return subject
  }

  unsubscribe(userId: number) {
    this.users.delete(userId)
  }

  pushNotification(notification: Notification) {
    const dest = this.users.get(notification.userId)

    if (dest !== undefined) {
      dest.next({ data: notification })
    }
  }

  async createNotification(userId: number, senderId: number, content: string) {
    try {
      return await this.prismaService.notification.create({
        data: { userId, senderId, content },
      })
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException('User not found')
      } else throw err
    }
  }

  async fetchFromDb(userId: number) {
    const notifications = await this.prismaService.notification.findMany({
      where: { userId },
    })

    await this.prismaService.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })

    return notifications
  }
}
