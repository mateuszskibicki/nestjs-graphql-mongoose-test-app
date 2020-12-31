import { AssignStudentsToLessonInput } from './dto/assign-students.input';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lesson, LessonDocument } from './models';
import { CreateLessonInput, GetLessonsArgs } from './dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
  ) {}

  async getLessons(getLessonsArgs: GetLessonsArgs): Promise<Lesson[]> {
    const { name, startDate, endDate } = getLessonsArgs;
    const find = {
      ...(name && { name }),
      ...(startDate && { startDate: { $gte: startDate } }),
      ...(endDate && { endDate: { $lte: endDate } }),
    };

    return await this.lessonModel.find({ ...find });
  }

  async getLessonById(id: string): Promise<Lesson> {
    return await this.lessonModel.findOne({ _id: id });
  }

  async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
    return await new this.lessonModel({ ...createLessonInput }).save();
  }

  async assignStudentsToLesson(
    assignStudents: AssignStudentsToLessonInput,
  ): Promise<Lesson> {
    const lesson = await this.getLessonById(assignStudents.lessonId);
    if (!lesson) throw new NotFoundException();

    await this.lessonModel.updateOne(
      { _id: assignStudents.lessonId },
      { $push: { students: assignStudents.studentIds } as any },
      { new: true },
    );

    return await this.getLessonById(assignStudents.lessonId);
  }
}
