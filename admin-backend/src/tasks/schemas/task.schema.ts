import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type TaskDocument = Task & Document

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  name: string

  @Prop({
    required: true,
    enum: ["Product Sync", "Order Tracking", "Inventory Update", "Price Monitor"],
  })
  type: string

  @Prop({ required: true })
  account: string

  @Prop({
    required: true,
    enum: ["Running", "Completed", "Failed", "Paused", "Pending"],
    default: "Pending",
  })
  status: string

  @Prop({ type: Number, default: 0, min: 0, max: 100 })
  progress: number

  @Prop()
  startTime?: Date

  @Prop()
  endTime?: Date

  @Prop()
  description?: string

  @Prop({ type: [String], default: [] })
  logs: string[]

  @Prop({ type: Object })
  config?: Record<string, any>

  @Prop({ type: Object })
  result?: Record<string, any>
}

export const TaskSchema = SchemaFactory.createForClass(Task)
