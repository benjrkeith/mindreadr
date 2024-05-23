import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { request } from 'pactum'

import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'

const TEST_PORT = 3333
const TEST_URL = `http://localhost:${TEST_PORT}`

export let app: INestApplication

global.beforeAll(async () => {
  if (app === undefined) {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    )

    await app.init()
    await app.listen(TEST_PORT)
  }

  const prisma = app.get(PrismaService)
  await prisma.cleanDb()

  request.setBaseUrl(TEST_URL)
})

global.afterAll(async () => {
  app.close()
})
