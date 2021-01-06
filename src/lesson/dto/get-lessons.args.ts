import { IsISO8601, IsOptional, IsString } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';
@ArgsType()
export class GetLessonsArgs {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsOptional()
  @IsISO8601()
  @Field({ nullable: true })
  endDate?: string;

  @IsOptional()
  @IsISO8601()
  @Field({ nullable: true })
  startDate?: string;
}
