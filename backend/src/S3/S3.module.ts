import { Module } from '@nestjs/common'

import { S3Service } from 'src/S3/S3.service'

@Module({
  providers: [S3Service],
})
export class S3Module {}
