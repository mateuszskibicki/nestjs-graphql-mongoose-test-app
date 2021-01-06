import { CurrentUserType } from '../../auth/interfaces';
import { GetTasksArgs } from '../dto';

export type GetTasksByUserIdParams = {
  user: CurrentUserType;
  getTasksArgs: GetTasksArgs;
};
