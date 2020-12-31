import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class AssignStudentsToLessonInput {
  @IsMongoId()
  @Field()
  lessonId: string;

  @IsMongoId({ each: true })
  @Field(() => [String])
  studentIds: string[];
}
