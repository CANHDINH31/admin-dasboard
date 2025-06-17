import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type AccountDocument = Account & Document

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true })
  marketplace: string

  @Prop({ required: true, unique: true })
  accName: string

  @Prop({ required: true })
  profileName: string

  @Prop()
  sheetID?: string

  @Prop()
  accountInfo?: string

  @Prop()
  proxy?: string

  @Prop()
  clientID?: string

  @Prop()
  clientSecret?: string

  @Prop()
  telegramId?: string

  @Prop({
    required: true,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  })
  status: string

  @Prop({ default: Date.now })
  lastSync: Date
}

export const AccountSchema = SchemaFactory.createForClass(Account)
