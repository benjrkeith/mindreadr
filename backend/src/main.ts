import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from 'src/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://192.168.0.200:5173'],
  })
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  await app.listen(3000)
}
bootstrap()
