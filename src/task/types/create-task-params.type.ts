import { CreateTaskInput } from '../dto';
import { CurrentUserType } from '../../auth/interfaces';

export type CreateTaskParams = {
  user: CurrentUserType;
  createTaskInput: CreateTaskInput;
};
