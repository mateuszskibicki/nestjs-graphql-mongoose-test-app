import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonResolver } from './lesson.resolver';
import { LessonService } from './lesson.service';
import { Lesson, LessonSchema } from './models';
import { StudentModule } from './../student/student.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }]),
    StudentModule,
  ],
  providers: [LessonResolver, LessonService],
})
export class LessonModule {}
