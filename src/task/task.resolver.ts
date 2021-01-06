import { UseGuards } from '@nestjs/common';
import {
  Args,
  Resolver,
  Query,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TaskType, Task } from './models';
import { TaskService } from './task.service';
import { AuthService } from '../auth/auth.service';
import { GqlAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import { CurrentUserType } from '../auth/interfaces';
import { User, UserType } from '../auth/models';
import {
  CreateTaskInput,
  GetTasksArgs,
  UpdateTaskInput,
  TaskIDArgs,
} from './dto';

const returnTaskType = () => TaskType;
const returnTasksType = () => [TaskType];

@Resolver(() => TaskType)
export class TaskResolver {
  constructor(
    private taskService: TaskService,
    private authService: AuthService,
  ) {}

  /**
   * Fetch single task by ID
   */
  @UseGuards(GqlAuthGuard)
  @Query(returnTaskType, { nullable: true })
  task(
    @Args() { id }: TaskIDArgs,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Task> {
    return this.taskService.getTaskById({ user, id });
  }

  /**
   * Fetch many tasks by user ID
   */
  @UseGuards(GqlAuthGuard)
  @Query(returnTasksType)
  tasks(
    @Args() getTasksArgs: GetTasksArgs,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Task[]> {
    return this.taskService.getTasksByUserId({ user, getTasksArgs });
  }

  /**
   * Create a task
   */
  @UseGuards(GqlAuthGuard)
  @Mutation(returnTaskType)
  createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Task> {
    return this.taskService.createTask({ user, createTaskInput });
  }

  /**
   * Update a task
   */
  @UseGuards(GqlAuthGuard)
  @Mutation(returnTaskType)
  updateTask(
    @Args() { id }: TaskIDArgs,
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Task> {
    return this.taskService.updateTask({ user, id, updateTaskInput });
  }

  /**
   * Delete a task
   */
  @UseGuards(GqlAuthGuard)
  @Mutation(returnTaskType)
  deleteTask(
    @Args() { id }: TaskIDArgs,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Task> {
    return this.taskService.deleteTask({ user, id });
  }

  /**
   * Resolve field user in Task model - just as an example how to resolve fields
   */
  @ResolveField('user', () => UserType)
  getUser(@Parent() task: Task): Promise<User> {
    return this.authService.getUser(task.user as string);
  }
}
