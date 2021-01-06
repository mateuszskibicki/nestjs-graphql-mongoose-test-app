import { registerEnumType } from '@nestjs/graphql';

export enum TaskStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  REJECTED = 'REJECTED',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Allowed task statuses',
});
