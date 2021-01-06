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
export class UpdateTaskInput {
  @IsOptional()
  @MinLength(10)
  @MaxLength(200)
  @Field({ nullable: true })
  description?: string;

  @IsOptional()
  @IsISO8601()
  @Field({ nullable: true })
  startDate?: string;

  @IsOptional()
  @IsOptional()
  @IsISO8601()
  @Field({ nullable: true })
  endDate?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;
}
