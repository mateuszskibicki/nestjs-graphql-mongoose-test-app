import { Field, InputType } from '@nestjs/graphql';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

@InputType()
export class AuthCredentialsDto {
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  @Field()
  username: string;

  @IsString()
  @MinLength(7)
  @MaxLength(50)
  @Field()
  // 1 upper case/ 1 lower case/ 1 number or special character
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password to weak.',
  })
  password: string;
}
