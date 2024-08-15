import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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
  async getUser(
    @GetUser('id') userId: number,
    @Param('username') username: string,
  ) {
    return await this.userService.getUser(userId, username)
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

  @Post(':targetId/followers')
  async followUser(
    @GetUser('id') userId: number,
    @Param('targetId', ParseIntPipe) targetId: number,
  ) {
    return await this.userService.followUser(userId, targetId)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':targetId/followers')
  async unfollowUser(
    @GetUser('id') userId: number,
    @Param('targetId', ParseIntPipe) targetId: number,
  ) {
    return await this.userService.unFollowUser(userId, targetId)
  }
}
