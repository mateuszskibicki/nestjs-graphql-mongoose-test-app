import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { TaskStatus } from '../enums';
import { UserDocument } from '../../auth/models';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: false })
  endDate: string;

  @Prop({
    required: true,
    default: TaskStatus.NEW,
    enum: [...Object.values(TaskStatus)],
  })
  status: TaskStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
    immutable: true,
  })
  user: string | UserDocument;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
