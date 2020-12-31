import { IsString } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetStudentsByIdsArgs {
  @IsString({ each: true })
  @Field(() => [String])
  ids: string[];
}
