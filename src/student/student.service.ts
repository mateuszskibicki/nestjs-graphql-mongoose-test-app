import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './models';
import {
  CreateStudentInput,
  GetStudentsArgs,
  GetStudentsByIdsArgs,
} from './dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async getStudents(getStudentsArgs: GetStudentsArgs): Promise<Student[]> {
    const { firstName, lastName } = getStudentsArgs;
    const find = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    };

    return await this.studentModel.find({ ...find });
  }

  async getStudentById(id: string): Promise<Student> {
    return await this.studentModel.findOne({ _id: id });
  }

  async getStudentsByIds(
    getStudentsByIdsArgs: GetStudentsByIdsArgs,
  ): Promise<Student[]> {
    return await this.studentModel.find({
      _id: { $in: getStudentsByIdsArgs.ids },
    });
  }

  async createStudent(
    createStudentInput: CreateStudentInput,
  ): Promise<Student> {
    return await new this.studentModel({ ...createStudentInput }).save();
  }
}
