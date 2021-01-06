import { CurrentUserType } from '../../auth/interfaces';

export type DeleteTaskByIdParams = {
  user: CurrentUserType;
  id: string;
};
