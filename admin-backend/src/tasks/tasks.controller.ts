import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  create(createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  update(@Param('id') id: string, updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start task' })
  @ApiResponse({ status: 200, description: 'Task started successfully' })
  start(@Param('id') id: string) {
    return this.tasksService.startTask(id);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause task' })
  @ApiResponse({ status: 200, description: 'Task paused successfully' })
  pause(@Param('id') id: string) {
    return this.tasksService.pauseTask(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete task' })
  @ApiResponse({ status: 200, description: 'Task completed successfully' })
  complete(@Param('id') id: string, result?: any) {
    return this.tasksService.completeTask(id, result);
  }
}
