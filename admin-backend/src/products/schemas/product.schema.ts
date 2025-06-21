import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true, unique: true })
  upc: string;

  @Prop({ required: true })
  wmid: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  sitePrice: number;

  @Prop({ required: true, type: Number })
  sellingPrice: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
