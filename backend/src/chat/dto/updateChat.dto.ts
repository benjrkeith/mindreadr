import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateChatDto {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  addUsers: number[] = []

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  removeUsers: number[] = []
}
