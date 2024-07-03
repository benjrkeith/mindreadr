import { Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'
import * as sharp from 'sharp'

import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class S3Service {
  S3: AWS.S3

  constructor(private prismaService: PrismaService) {
    AWS.config.update({ region: process.env.AWS_REGION })
    this.S3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS,
      secretAccessKey: process.env.AWS_SECRET,
    })
  }

  async upload(file: Express.Multer.File, name: string) {
    const avatar = name.includes('avatar')
    const converted = await sharp(file.buffer)
      .resize(avatar ? 512 : 1024, 512)
      .png()
      .toBuffer()

    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET,
      Key: String(name) + '.png',
      Body: converted,
    }

    const res = await this.S3.upload(params).promise()
    return { url: res.Location }
  }
}
