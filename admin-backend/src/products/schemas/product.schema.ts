import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type ProductDocument = Product & Document

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true })
  sku: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  account: string

  @Prop({ required: true })
  marketplace: string

  @Prop({ required: true, type: Number })
  price: number

  @Prop({ required: true, type: Number, default: 0 })
  stock: number

  @Prop({
    required: true,
    enum: ["active", "inactive", "out of stock"],
    default: "active",
  })
  status: string

  @Prop({
    required: true,
    enum: ["tracking", "paused", "stopped"],
    default: "tracking",
  })
  trackingStatus: string

  @Prop({ type: Number, default: 0 })
  views: number

  @Prop({ type: Number, default: 0 })
  sales: number

  @Prop({ type: Number, default: 0 })
  revenue: number

  @Prop({ type: Number, default: 0 })
  conversionRate: number

  @Prop()
  description?: string

  @Prop({ type: [String], default: [] })
  images: string[]

  @Prop()
  category?: string

  @Prop({ type: Object })
  metadata?: Record<string, any>
}

export const ProductSchema = SchemaFactory.createForClass(Product)
