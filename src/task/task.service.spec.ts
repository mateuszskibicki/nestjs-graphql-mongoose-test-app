// import { Task, TaskSchema } from './models';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
// import { AuthModule } from '../auth/auth.module';
// import { AuthService } from '../auth/auth.service';
import { TaskDocument } from './models';
import { TaskService } from './task.service';
import { NotFoundException } from '@nestjs/common';

const mockTask = () => ({});
const mockUser = () => ({});

describe('TaskService', () => {
  let taskService: TaskService;
  // let authService: AuthService;
  let taskModel: Model<TaskDocument>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken('Task'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockTask()),
            constructor: jest.fn().mockResolvedValue(mockTask()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
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
          .mockResolvedValue({ _id: 'userId' } as any);
        const res = await taskService.getTaskById({
          user: { _id: 'userId' } as any,
          id: 'abc',
        });
        expect(res).toEqual({ _id: 'userId' });
      });
    });
  });
});
