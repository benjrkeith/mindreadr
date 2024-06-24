import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from 'src/app.module'
import * as fs from 'fs'

// Configure the opts for SSL certificates
const key = fs.readFileSync('certs/key.base64').toString()
const cert = fs.readFileSync('certs/cert.base64').toString()
const options = {
  httpsOptions: {
    key: Buffer.from(key, 'base64').toString('utf-8'),
    cert: Buffer.from(cert, 'base64').toString('utf-8'),
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
