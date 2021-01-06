import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './models';
import { AuthModule } from '../auth/auth.module';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    AuthModule,
  ],
  providers: [TaskResolver, TaskService],
})
export class TaskModule {}
