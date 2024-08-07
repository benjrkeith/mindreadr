import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { FileInterceptor } from '@nestjs/platform-express'

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

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return await this.userService.uploadAvatar(file, user.username)
  }

  @Post('cover')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCover(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return await this.userService.uploadCover(file, user.username)
  }
}
