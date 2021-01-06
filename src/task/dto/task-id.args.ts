import { IsMongoId } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class TaskIDArgs {
  @IsMongoId()
  @Field()
  id: string;
}
