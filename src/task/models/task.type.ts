import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TaskStatus } from '../enums';
import { UserType } from '../../auth/models';

@ObjectType('Task')
export class TaskType {
  @Field(() => ID)
  id: string;

  @Field()
  description: string;

  @Field()
  startDate: string;

  @Field({ nullable: true })
  endDate: string;

  @Field(() => TaskStatus, { defaultValue: TaskStatus.NEW })
  status: TaskStatus;

  @Field(() => UserType)
  user: UserType;
}
