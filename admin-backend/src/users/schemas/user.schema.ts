import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: ['admin', 'manager', 'user', 'viewer'],
    default: 'user',
  })
  role: string;

  @Prop({
    required: true,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  })
  status: string;

  @Prop()
  phone?: string;

  @Prop()
  department?: string;

  @Prop()
  avatar?: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop()
  notes?: string;

  @Prop({ default: Date.now })
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
