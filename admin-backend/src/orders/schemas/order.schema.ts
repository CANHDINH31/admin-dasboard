import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type OrderDocument = Order & Document

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  poNumber: string

  @Prop({ required: true })
  customerName: string

  @Prop({ required: true })
  account: string

  @Prop({ required: true })
  marketplace: string

  @Prop({ required: true })
  sku: string

  @Prop({
    required: true,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing",
  })
  status: string

  @Prop({
    required: true,
    enum: ["In Transit", "Delivered", "Pending", "Lost"],
    default: "Pending",
  })
  trackingStatus: string

  @Prop({ required: true })
  shipBy: string

  @Prop({ required: true, type: Number })
  amount: number

  @Prop({ required: true })
  orderDate: Date

  @Prop()
  trackingNumber?: string

  @Prop()
  shippingAddress?: string

  @Prop({ type: Object })
  metadata?: Record<string, any>
}

export const OrderSchema = SchemaFactory.createForClass(Order)
