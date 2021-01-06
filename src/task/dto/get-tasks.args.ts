import { IsEnum, IsISO8601, IsOptional } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';
import { TaskStatus } from '../enums';

@ArgsType()
export class GetTasksArgs {
  @IsOptional()
  @IsEnum(TaskStatus)
  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;

  @IsOptional()
  @IsISO8601()
  @Field({ nullable: true })
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  @Field({ nullable: true })
  endDate?: string;
}
