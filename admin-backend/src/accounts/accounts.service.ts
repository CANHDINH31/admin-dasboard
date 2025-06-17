import { Injectable, NotFoundException } from '@nestjs/common';
import type { Model } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema';
import type { CreateAccountDto } from './dto/create-account.dto';
import type { UpdateAccountDto } from './dto/update-account.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const createdAccount = new this.accountModel(createAccountDto);
    return createdAccount.save();
  }

  async findAll(): Promise<Account[]> {
    return this.accountModel.find().exec();
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountModel.findById(id).exec();
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const updatedAccount = await this.accountModel
      .findByIdAndUpdate(id, updateAccountDto, { new: true })
      .exec();

    if (!updatedAccount) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return updatedAccount;
  }

  async remove(id: string): Promise<void> {
    const result = await this.accountModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
  }

  async updateLastSync(id: string): Promise<void> {
    await this.accountModel
      .findByIdAndUpdate(id, { lastSync: new Date() })
      .exec();
  }
}
