import { ArrayMinSize, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  users: number[]
}
