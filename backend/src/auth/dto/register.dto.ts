import { IsDateString, IsNotEmpty, IsString } from 'class-validator'

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsDateString()
  dob: Date
}
