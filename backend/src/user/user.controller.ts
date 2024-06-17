import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { User } from '@prisma/client'

import { GetUser } from 'src/auth/decorator'
import { EditUserDto } from 'src/user/dto'
import { JwtGuard } from 'src/auth/guard'
import { UserService } from 'src/user/user.service'

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsernames() {
    return await this.userService.getAllUsernames()
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    return await this.userService.getUser(username)
  }

  @Patch()
  editUser(@GetUser() user: User, @Body() dto: EditUserDto) {
    return this.userService.editUser(user.id, dto)
  }
}
