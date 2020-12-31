import { Field, ID, InputType } from '@nestjs/graphql';
import { MinLength, IsISO8601 } from 'class-validator';

@InputType()
export class CreateLessonInput {
  @MinLength(3)
  @Field()
  name: string;

  @IsISO8601()
  @Field()
  startDate: string;

  @IsISO8601()
  @Field()
  endDate: string;

  @Field(() => [ID], { defaultValue: [] })
  students: string[];
}
