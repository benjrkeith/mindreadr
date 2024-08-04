import { hash, verify } from 'argon2'
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto, RegisterDto } from 'src/auth/dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: AuthDto): Promise<User & { token: string }> {
    const { username, password } = dto

    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (user === null) {
      throw new NotFoundException('Username is not registered')
    }

    const isPasswordValid = await verify(user.password, password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect')
    }

    delete user.password
    const token = await this.signToken(user.id, user.username)
    return { ...user, token }
  }

  async register(dto: RegisterDto): Promise<Partial<User> & { token: string }> {
    const { username, password } = dto
    const passwordHash = await hash(password)

    try {
      const user = await this.prisma.user.create({
        data: {
          username,
          password: passwordHash,
        },
        omit: { password: true },
      })

      const token = await this.signToken(user.id, user.username)
      return { ...user, token }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Username is already in use')
        }
      }

      throw error
    }
  }

  signToken(id: number, username: string): Promise<string> {
    const payload = { sub: id, username }

    return this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret: process.env.JWT_SECRET,
    })
  }

  async doesUserExist(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { username } })
    return user !== null
  }
}
