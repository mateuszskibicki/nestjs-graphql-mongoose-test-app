import { IsOptional, IsString } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetStudentsArgs {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  firstName?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  lastName?: string;
}
