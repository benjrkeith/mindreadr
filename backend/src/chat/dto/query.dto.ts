import { IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export class QueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    const int = parseInt(value)
    return isNaN(int) ? undefined : int
  })
  skip?: number

  @IsOptional()
  @Transform(({ value }) => {
    const int = parseInt(value)
    return isNaN(int) ? undefined : int
  })
  take?: number
}
