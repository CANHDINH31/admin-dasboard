import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AdminSeed } from './users/seeds/admin.seed';
import { FakeUsersSeed } from './users/seeds/fake-users.seed';
import { FakeAccountsSeed } from './accounts/seeds/fake-accounts.seed';
import { FakeProductsSeed } from './products/seeds/fake-products.seed';

async function seed() {
  console.log('🌱 Starting database seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Get the seed services
    const adminSeed = app.get(AdminSeed);
    const fakeUsersSeed = app.get(FakeUsersSeed);
    const fakeAccountsSeed = app.get(FakeAccountsSeed);
    const fakeProductsSeed = app.get(FakeProductsSeed);

    // Run admin seed first
    console.log('👑 Seeding admin user...');
    await adminSeed.seed();

    // Run fake users seed
    console.log('👥 Seeding fake users...');
    await fakeUsersSeed.seed(50); // Generate 50 fake users

    // Run fake accounts seed
    console.log('🏦 Seeding fake accounts...');
    await fakeAccountsSeed.seed(30); // Generate 30 fake accounts

    console.log('🏦 Seeding fake products with 30 products ...');
    await fakeProductsSeed.seed(30); // Generate 30 fake products

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('🎉 Seeding process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding process failed:', error);
    process.exit(1);
  });
