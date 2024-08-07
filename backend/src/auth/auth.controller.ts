import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common'

import { AuthService } from 'src/auth/auth.service'
import { AuthDto, RegisterDto } from 'src/auth/dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto)
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Get('exists/:username')
  async checkExists(@Param('username') username: string) {
    return await this.authService.doesUserExist(username)
  }
}
