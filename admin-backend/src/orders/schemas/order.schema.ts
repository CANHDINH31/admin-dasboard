import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  trackingStatus: string;

  @Prop({ required: true })
  orderNumEmail: string;

  @Prop({ required: true })
  poNumber: string;

  @Prop({ required: true })
  orderNumber: string;

  @Prop({ required: true })
  orderDate: Date;

  @Prop({ required: true })
  shipBy: Date;

  @Prop({ required: true })
  customerShippingAddress: string;

  @Prop({ required: true, type: Number })
  quantity: number;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true, type: Number })
  sellingPrice: number;

  @Prop({ required: true, type: Number })
  sourcingPrice: number;

  @Prop({ type: Number })
  walmartFee?: number;

  @Prop({ type: Number })
  netProfit?: number;

  @Prop({ type: Number })
  roi?: number;

  @Prop({ type: Number })
  commission?: number;

  @Prop()
  upc?: string;

  @Prop()
  name?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
