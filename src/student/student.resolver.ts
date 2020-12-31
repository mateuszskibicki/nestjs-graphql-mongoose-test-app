import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StudentService } from './student.service';
import { StudentType, Student } from './models';
import {
  CreateStudentInput,
  GetStudentsArgs,
  GetStudentsByIdsArgs,
} from './dto';

const returnStudentType = () => StudentType;
const returnStudentsType = () => [StudentType];

@Resolver(returnStudentType)
export class StudentResolver {
  constructor(private studentService: StudentService) {}

  /**
   * Fetch single student by ID
   */
  @Query(returnStudentType, { nullable: true })
  student(@Args('id') id: string): Promise<Student> {
    return this.studentService.getStudentById(id);
  }

  /**
   * Fetch many students (optional params)
   */
  @Query(returnStudentsType)
  students(@Args() getStudentsArgs: GetStudentsArgs): Promise<Student[]> {
    return this.studentService.getStudents(getStudentsArgs);
  }

  /**
   * Fetch many students by IDs
   */
  @Query(returnStudentsType)
  studentsByIds(
    @Args() getStudentsByIdsArgs: GetStudentsByIdsArgs,
  ): Promise<Student[]> {
    return this.studentService.getStudentsByIds(getStudentsByIdsArgs);
  }

  /**
   * Create a student
   */
  @Mutation(returnStudentType)
  createStudent(
    @Args('createStudentInput') createStudentInput: CreateStudentInput,
  ): Promise<Student> {
    return this.studentService.createStudent(createStudentInput);
  }
}
