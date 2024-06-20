import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from 'src/app.module'
import * as fs from 'fs'

const options = {
  httpsOptions: {
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/cert.pem'),
  },
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, options)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://192.168.0.200:5173'],
  })
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  await app.listen(process.env.PORT)
}
bootstrap()
