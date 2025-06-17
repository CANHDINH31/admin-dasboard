import { Injectable, NotFoundException } from '@nestjs/common';
import type { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async startTask(id: string): Promise<Task> {
    const task = await this.taskModel
      .findByIdAndUpdate(
        id,
        {
          status: 'Running',
          startTime: new Date(),
          progress: 0,
        },
        { new: true },
      )
      .exec();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async pauseTask(id: string): Promise<Task> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, { status: 'Paused' }, { new: true })
      .exec();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async completeTask(id: string, result?: any): Promise<Task> {
    const task = await this.taskModel
      .findByIdAndUpdate(
        id,
        {
          status: 'Completed',
          endTime: new Date(),
          progress: 100,
          result,
        },
        { new: true },
      )
      .exec();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async updateProgress(id: string, progress: number): Promise<Task> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, { progress }, { new: true })
      .exec();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async addLog(id: string, log: string): Promise<Task> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, { $push: { logs: log } }, { new: true })
      .exec();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }
}
