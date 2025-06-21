import { Injectable, NotFoundException } from '@nestjs/common';
import type { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 25,
    search?: string,
  ): Promise<{
    data: Product[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const query: any = {};
    if (search) {
      query.$or = [
        { sku: { $regex: search, $options: 'i' } },
        { upc: { $regex: search, $options: 'i' } },
        { wmid: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.productModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.productModel.countDocuments(query).exec(),
    ]);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async findByAccount(account: string): Promise<Product[]> {
    return this.productModel.find({ account }).exec();
  }

  async findByMarketplace(marketplace: string): Promise<Product[]> {
    return this.productModel.find({ marketplace }).exec();
  }

  async updateStats(
    id: string,
    stats: { views?: number; sales?: number; revenue?: number },
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, stats, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }
}
