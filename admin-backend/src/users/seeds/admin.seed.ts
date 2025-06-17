import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeed {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async seed() {
    const adminExists = await this.userModel.findOne({
      email: 'admin@gmail.com',
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      await this.userModel.create({
        fullName: 'System Administrator',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        permissions: [
          'view_dashboard',
          'manage_users',
          'manage_accounts',
          'manage_products',
          'manage_orders',
          'manage_tasks',
        ],
      });

      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  }
}
