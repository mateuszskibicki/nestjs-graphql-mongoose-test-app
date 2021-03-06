import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './models';
import {
  GetTaskByIdParams,
  GetTasksByUserIdParams,
  CreateTaskParams,
  UpdateTaskParams,
  DeleteTaskByIdParams,
} from './types';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  /**
   * Get single task by ID
   * @param {GetTaskByIdParams} params
   * @throws {NotFoundException}
   * @returns {Task}
   */
  async getTaskById({ user, id }: GetTaskByIdParams): Promise<Task> {
    const task = await this.taskModel.findOne({
      _id: id,
      user: user._id,
    });
    if (!task) throw new NotFoundException();
    return task;
  }

  /**
   * Get many tasks by user ID
   * @param {GetTasksByUserIdParams} params
   * @returns {Task[]}
   */
  async getTasksByUserId({
    user,
    getTasksArgs,
  }: GetTasksByUserIdParams): Promise<Task[]> {
    const find = {
      user: user._id,
      ...(getTasksArgs.status && { status: getTasksArgs.status }),
      ...(getTasksArgs.startDate && {
        startDate: { $gte: getTasksArgs.startDate },
      }),
      ...(getTasksArgs.endDate && { endDate: { $lte: getTasksArgs.endDate } }),
    };

    return await this.taskModel.find(find).sort({ startDate: -1 });
  }

  /**
   * Create single task
   * @param {CreateTaskParams} params
   * @returns {Task}
   */
  async createTask({ user, createTaskInput }: CreateTaskParams): Promise<Task> {
    return await this.taskModel.create({
      user: user._id,
      startDate: createTaskInput.startDate,
      endDate: createTaskInput.endDate,
      description: createTaskInput.description,
      status: createTaskInput.status,
    });
  }

  /**
   * Update single task
   * @param {UpdateTaskParams} params
   * @throws {NotFoundException}
   * @returns {Task}
   */
  async updateTask({
    user,
    updateTaskInput,
    id,
  }: UpdateTaskParams): Promise<Task> {
    const task = await this.getTaskById({ user, id });
    await this.taskModel.updateOne(
      { _id: id },
      {
        ...new this.taskModel(task).toObject(),
        ...updateTaskInput,
      },
    );
    return await this.getTaskById({ user, id });
  }

  /**
   * Delete single task by ID
   * @param {DeleteTaskByIdParams} params
   * @throws {NotFoundException}
   * @returns {Task}
   */
  async deleteTask({ user, id }: DeleteTaskByIdParams): Promise<boolean> {
    await this.getTaskById({ user, id });
    await this.taskModel.deleteOne({ _id: id });
    return true;
  }
}
