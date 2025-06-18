import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class FakeUsersSeed {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Vietnamese names for realistic data
  private readonly firstNames = [
    'Nguyễn',
    'Trần',
    'Lê',
    'Phạm',
    'Hoàng',
    'Huỳnh',
    'Phan',
    'Vũ',
    'Võ',
    'Đặng',
    'Bùi',
    'Đỗ',
    'Hồ',
    'Ngô',
    'Dương',
    'Lý',
    'Mai',
    'Đinh',
    'Tô',
    'Hà',
    'Lâm',
    'Tạ',
    'Châu',
    'Thái',
    'Tăng',
    'Hứa',
    'Đoàn',
    'Trịnh',
    'Kiều',
    'Tống',
    'Lưu',
    'Hồng',
    'Thạch',
    'Quách',
    'Từ',
    'Hùng',
    'Thành',
    'Cao',
    'Đức',
    'Minh',
  ];

  private readonly lastNames = [
    'Văn',
    'Thị',
    'Hoàng',
    'Minh',
    'Thành',
    'Công',
    'Duy',
    'Huy',
    'Tuấn',
    'Nam',
    'Hải',
    'Phương',
    'Linh',
    'Anh',
    'Hương',
    'Thảo',
    'Nga',
    'Hà',
    'Lan',
    'Mai',
    'Trang',
    'Huyền',
    'Ngọc',
    'Bích',
    'Diệp',
    'Quỳnh',
    'Tuyết',
    'Hạnh',
    'Dung',
    'Nhung',
    'Hằng',
    'Thủy',
    'Hoa',
    'Liên',
    'Hồng',
    'Thanh',
    'Tâm',
    'Hà',
    'Vân',
    'Yến',
  ];

  private readonly domains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'company.com',
    'business.com',
    'tech.com',
    'digital.com',
    'enterprise.com',
    'corp.com',
  ];

  private readonly departments = [
    'IT',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
    'Customer Service',
    'Product',
    'Design',
    'Engineering',
    'Business Development',
    'Legal',
  ];

  private readonly permissions = [
    'view_dashboard',
    'manage_users',
    'manage_accounts',
    'manage_products',
    'manage_orders',
    'manage_tasks',
  ];

  private generateRandomName(): string {
    const firstName =
      this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    const lastName =
      this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
    return `${firstName} ${lastName}`;
  }

  private generateRandomEmail(fullName: string): string {
    const nameParts = fullName.toLowerCase().split(' ').join('');
    const randomNumber = Math.floor(Math.random() * 999) + 1;
    const domain =
      this.domains[Math.floor(Math.random() * this.domains.length)];
    return `${nameParts}${randomNumber}@${domain}`;
  }

  private generateRandomPermissions(): string[] {
    const numPermissions = Math.floor(Math.random() * 4) + 1; // 1-4 permissions
    const shuffled = [...this.permissions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numPermissions);
  }

  private generateRandomRole(): 'admin' | 'user' {
    return Math.random() < 0.15 ? 'admin' : 'user'; // 15% chance of admin
  }

  async seed(count: number = 50) {
    console.log(`Starting to seed ${count} fake users...`);

    const existingUsers = await this.userModel.countDocuments();
    if (existingUsers > 10) {
      console.log('Users already exist, skipping fake user seeding...');
      return;
    }

    const usersToCreate: Array<{
      fullName: string;
      email: string;
      password: string;
      role: 'admin' | 'user';
      permissions: string[];
    }> = [];
    const usedEmails = new Set();

    for (let i = 0; i < count; i++) {
      let fullName, email;

      // Generate unique email
      do {
        fullName = this.generateRandomName();
        email = this.generateRandomEmail(fullName);
      } while (usedEmails.has(email));

      usedEmails.add(email);

      const role = this.generateRandomRole();
      const permissions = this.generateRandomPermissions();

      // Ensure admins have more permissions
      if (role === 'admin') {
        permissions.push('view_dashboard');
        if (!permissions.includes('manage_users')) {
          permissions.push('manage_users');
        }
      }

      // Ensure all users have at least view_dashboard
      if (!permissions.includes('view_dashboard')) {
        permissions.unshift('view_dashboard');
      }

      const hashedPassword = await bcrypt.hash('Password123!', 10);

      usersToCreate.push({
        fullName,
        email,
        password: hashedPassword,
        role,
        permissions: [...new Set(permissions)], // Remove duplicates
      });
    }

    try {
      await this.userModel.insertMany(usersToCreate);
      console.log(`✅ Successfully created ${count} fake users`);

      // Log some statistics
      const adminCount = usersToCreate.filter((u) => u.role === 'admin').length;
      const userCount = usersToCreate.filter((u) => u.role === 'user').length;

      console.log(`📊 Statistics:`);
      console.log(`   - Admins: ${adminCount}`);
      console.log(`   - Users: ${userCount}`);
      console.log(`   - Total: ${count}`);
    } catch (error) {
      console.error('❌ Error creating fake users:', error.message);
    }
  }

  async clear() {
    try {
      // Keep the original admin user
      await this.userModel.deleteMany({ email: { $ne: 'admin@gmail.com' } });
      console.log('✅ Cleared all fake users (kept admin user)');
    } catch (error) {
      console.error('❌ Error clearing fake users:', error.message);
    }
  }
}
