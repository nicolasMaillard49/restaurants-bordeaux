import { IsEmail, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsIn(['suggestion', 'question', 'partnership', 'bug', 'other'])
  subject: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
