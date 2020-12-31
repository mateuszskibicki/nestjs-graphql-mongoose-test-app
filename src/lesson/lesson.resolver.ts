import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { LessonService } from './lesson.service';
import { LessonType, Lesson } from './models';
import {
  CreateLessonInput,
  GetLessonsArgs,
  AssignStudentsToLessonInput,
} from './dto';
import { Student, StudentType } from '../student/models';
import { StudentService } from '../student/student.service';

const returnLessonType = () => LessonType;
const returnLessonsType = () => [LessonType];

@Resolver(returnLessonType)
export class LessonResolver {
  constructor(
    private lessonService: LessonService,
    private studentSerice: StudentService,
  ) {}

  /**
   * Fetch single lesson by ID
   */
  @Query(returnLessonType, { nullable: true })
  lesson(@Args('id') id: string): Promise<Lesson> {
    return this.lessonService.getLessonById(id);
  }

  /**
   * Fetch many lessons (optional params)
   */
  @Query(returnLessonsType)
  lessons(@Args() getLessonsArgs: GetLessonsArgs): Promise<Lesson[]> {
    return this.lessonService.getLessons(getLessonsArgs);
  }

  /**
   * Create a lesson
   */
  @Mutation(returnLessonType)
  createLesson(
    @Args('createLessonInput') createLessonInput: CreateLessonInput,
  ): Promise<Lesson> {
    return this.lessonService.createLesson(createLessonInput);
  }

  /**
   * Assign student ID to a Lesson.students array
   */
  @Mutation(returnLessonType)
  assignStudentsToLesson(
    @Args('assignStudentsToLessonInput')
    assignStudentsToLessonInput: AssignStudentsToLessonInput,
  ): Promise<Lesson> {
    return this.lessonService.assignStudentsToLesson(
      assignStudentsToLessonInput,
    );
  }

  /**
   * Resolve field students in Lesson model
   */
  @ResolveField('students', () => [StudentType])
  getStudentsByIds(@Parent() lesson: Lesson): Promise<Student[]> {
    return this.studentSerice.getStudentsByIds({ ids: lesson.students });
  }
}
