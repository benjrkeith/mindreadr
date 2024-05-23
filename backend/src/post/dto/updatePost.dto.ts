import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  content: string
}
