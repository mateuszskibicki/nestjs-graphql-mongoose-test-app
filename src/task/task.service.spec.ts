import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
// import { AuthModule } from '../auth/auth.module';
// import { AuthService } from '../auth/auth.service';
import { TaskDocument } from './models';
import { TaskService } from './task.service';
import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from './enums';

class ModelMock {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static create = jest.fn().mockResolvedValue({});
  static find = jest.fn().mockResolvedValue([]);
  static findOne = jest.fn().mockResolvedValue({});
  static findOneAndUpdate = jest.fn().mockResolvedValue({});
  static updateOne = jest.fn().mockResolvedValue({});
  static deleteOne = jest.fn().mockResolvedValue(true);
  toObject = jest.fn().mockReturnThis();
}

describe('TaskService', () => {
  let taskService: TaskService;
  // let authService: AuthService;
  let taskModel: Model<TaskDocument>;

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken('Task'),
          useValue: ModelMock,
        },
        {
          provide: getModelToken('User'),
          useValue: ModelMock,
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskModel = module.get<Model<TaskDocument>>(getModelToken('Task'));
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('getTaskById', () => {
    it('should be defined and a function', () => {
      expect(taskService.getTaskById).toBeDefined();
      expect(typeof taskService.getTaskById === 'function').toBeDefined();
    });

    describe('when task not found', () => {
      it('should throw NotFoundException', async () => {
        jest.spyOn(taskModel, 'findOne').mockResolvedValue(null);
        const promise = taskService.getTaskById({
          user: { _id: 'userId' } as any,
          id: 'abc',
        });
        expect(async () => await promise).rejects.toThrow(NotFoundException);
      });
    });

    describe('when success', () => {
      it('should call findOne method with correct params', async () => {
        const spy = jest
          .spyOn(taskModel, 'findOne')
          .mockResolvedValue({} as any);
        await taskService.getTaskById({
          user: { _id: 'userId' } as any,
          id: 'abc',
        });
        expect(spy).toHaveBeenCalledWith({
          _id: 'abc',
          user: 'userId',
        });
      });

      it('should return correct task', async () => {
        jest
          .spyOn(taskModel, 'findOne')
          .mockResolvedValue({ _id: 'taskId' } as any);
        const res = await taskService.getTaskById({
          user: { _id: 'userId' } as any,
          id: 'abc',
        });
        expect(res).toEqual({ _id: 'taskId' });
      });
    });
  });

  describe('getTasksByUserId', () => {
    it('should be defined and a function', () => {
      expect(taskService.getTasksByUserId).toBeDefined();
      expect(typeof taskService.getTasksByUserId === 'function').toBeDefined();
    });

    describe('when tasks not found', () => {
      it('should return an empty array', async () => {
        jest
          .spyOn(taskModel, 'find')
          .mockReturnValue({ sort: () => [] } as any);
        const res = await taskService.getTasksByUserId({
          user: { _id: 'userId' } as any,
          getTasksArgs: {},
        });
        expect(res).toEqual([]);
      });
    });

    describe('when success', () => {
      it('should call find method with correct params', async () => {
        const spy = jest
          .spyOn(taskModel, 'find')
          .mockReturnValue({ sort: () => [] } as any);
        await taskService.getTasksByUserId({
          user: { _id: 'userId' } as any,
          getTasksArgs: {},
        });
        expect(spy).toHaveBeenCalledWith({
          user: 'userId',
        });
      });

      it('should return tasks', async () => {
        jest.spyOn(taskModel, 'find').mockReturnValue({
          sort: () => [{ _id: 'taskId1' }, { _id: 'taskId2' }],
        } as any);
        const res = await taskService.getTasksByUserId({
          user: { _id: 'userId' } as any,
          getTasksArgs: {},
        });
        expect(res).toEqual([{ _id: 'taskId1' }, { _id: 'taskId2' }]);
      });
    });

    describe('optional params', () => {
      it('should call find method with correct optional params', async () => {
        const spy = jest
          .spyOn(taskModel, 'find')
          .mockReturnValue({ sort: () => [] } as any);
        await taskService.getTasksByUserId({
          user: { _id: 'userId' } as any,
          getTasksArgs: {
            endDate: 'endDate',
            startDate: 'startDate',
            status: TaskStatus.IN_PROGRESS,
          },
        });
        expect(spy).toHaveBeenCalledWith({
          user: 'userId',
          endDate: { $lte: 'endDate' },
          startDate: { $gte: 'startDate' },
          status: TaskStatus.IN_PROGRESS,
        });
      });
    });
  });

  describe('createTask', () => {
    it('should be defined and a function', () => {
      expect(taskService.createTask).toBeDefined();
      expect(typeof taskService.createTask === 'function').toBeDefined();
    });

    describe('when success', () => {
      it('should call create method with correct params', async () => {
        const spy = jest.spyOn(taskModel, 'create').mockReturnValue({} as any);
        await taskService.createTask({
          user: { _id: 'userId' } as any,
          createTaskInput: {
            description: 'description',
            startDate: '2020-01-01',
          },
        });
        expect(spy).toHaveBeenCalledWith({
          user: 'userId',
          description: 'description',
          startDate: '2020-01-01',
        });
      });

      it('should return task', async () => {
        jest.spyOn(taskModel, 'create').mockReturnValue({
          _id: 'userId',
          description: 'description',
          startDate: '2020-01-01',
        } as any);
        const res = await taskService.createTask({
          user: { _id: 'userId' } as any,
          createTaskInput: {
            description: 'description',
            startDate: '2020-01-01',
          },
        });
        expect(res).toEqual({
          _id: 'userId',
          description: 'description',
          startDate: '2020-01-01',
        });
      });
    });
  });

  describe('updateTask', () => {
    it('should be defined and a function', () => {
      expect(taskService.updateTask).toBeDefined();
      expect(typeof taskService.updateTask === 'function').toBeDefined();
    });

    describe('when finding task', () => {
      it('should call method getTaskById with correct params', async () => {
        const spy = jest
          .spyOn(taskService, 'getTaskById')
          .mockReturnValue({} as any);

        await taskService.updateTask({
          id: 'taskId',
          user: { _id: 'userId' } as any,
          updateTaskInput: {
            description: 'description',
            startDate: '2020-01-01',
          },
        });

        expect(spy).toHaveBeenCalledWith({
          id: 'taskId',
          user: { _id: 'userId' },
        });
      });

      describe('when task does not exist', () => {
        it('should throw NotFoundException task with provided ID is not ', async () => {
          jest.spyOn(taskModel, 'findOne').mockReturnValue(null);

          const promise = taskService.updateTask({
            id: 'taskId',
            user: { _id: 'userId' } as any,
            updateTaskInput: {
              description: 'description',
              startDate: '2020-01-01',
            },
          });

          expect(async () => await promise).rejects.toThrow(NotFoundException);
        });
      });
    });

    describe('when success', () => {
      it('should call updateOne method with correct params', async () => {
        jest.spyOn(taskModel, 'findOne').mockReturnValue({} as any);
        const spy = jest
          .spyOn(taskModel, 'updateOne')
          .mockReturnValue({ description: 'description' } as any);

        await taskService.updateTask({
          id: 'taskId',
          user: { _id: 'userId' } as any,
          updateTaskInput: {
            description: 'new description',
            startDate: '2020-01-01',
          },
        });
        expect(spy).toHaveBeenCalledWith(
          { _id: 'taskId' },
          expect.objectContaining({
            description: 'new description',
            startDate: '2020-01-01',
          }),
        );
      });

      it('should return updated task', async () => {
        jest
          .spyOn(taskService, 'getTaskById')
          .mockResolvedValueOnce({ description: 'description' } as any)
          .mockResolvedValueOnce({
            description: 'new description',
            startDate: '2020-01-01',
          } as any);
        jest.spyOn(taskModel, 'updateOne').mockReturnValue({} as any);

        const res = await taskService.updateTask({
          id: 'taskId',
          user: { _id: 'userId' } as any,
          updateTaskInput: {
            description: 'new description',
            startDate: '2020-01-01',
          },
        });
        expect(res).toEqual(
          expect.objectContaining({
            description: 'new description',
            startDate: '2020-01-01',
          }),
        );
      });
    });
  });
});
