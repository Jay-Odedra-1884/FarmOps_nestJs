import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateExpenseDto } from './dto/update-expenses.dto';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    const userId = req.user.userId
    return this.expensesService.create(createExpenseDto, userId);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('farm_id') farmId?: string,
  ) {
    const userId = req.user.userId;
    const pageNumber = page ? parseInt(page, 10) : 1;

    if (farmId) {
      return this.expensesService.findByFarm(parseInt(farmId, 10), userId, pageNumber);
    }
    return this.expensesService.findAll(userId, pageNumber);
  }

  @Patch(':id')
  update(@Body() updateExpenseDto: UpdateExpenseDto, @Param('id') id: number, @Request() req) {
    const userId = req.user.userId;
    return this.expensesService.update(id, updateExpenseDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Request() req) {
    const userId = req.user.userId;
    return this.expensesService.remove(id, userId);
  }
}
