import { User } from '../models';

export type CurrentUserType = User & { _id: string };
