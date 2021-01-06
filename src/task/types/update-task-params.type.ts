import { UpdateTaskInput } from '../dto';
import { CurrentUserType } from '../../auth/interfaces';

export type UpdateTaskParams = {
  user: CurrentUserType;
  updateTaskInput: UpdateTaskInput;
  id: string;
};
