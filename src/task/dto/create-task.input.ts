import { Field, InputType } from '@nestjs/graphql';
import {
  MinLength,
  IsISO8601,
  IsEnum,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { TaskStatus } from '../enums';

@InputType()
export class CreateTaskInput {
  @MinLength(10)
  @MaxLength(200)
  @Field()
  description: string;

  @IsISO8601()
  @Field()
  startDate: string;

  @IsOptional()
  @IsISO8601()
  @Field({ nullable: true })
  endDate?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  @Field(() => TaskStatus, { nullable: true, defaultValue: TaskStatus.NEW })
  status?: TaskStatus;
}
