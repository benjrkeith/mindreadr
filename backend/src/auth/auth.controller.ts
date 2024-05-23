import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { AuthService } from 'src/auth/auth.service'
import { AuthDto } from 'src/auth/dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto)
  }

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto)
  }
}
