import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ExpensesCategoriesService } from './expenses-categories.service';
import { CreateExpensesCategoryDto } from './dto/create-expenses-category.dto';
import { UpdateExpensesCategoryDto } from './dto/update-expenses-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('expenses-categories')
export class ExpensesCategoriesController {
  constructor(private readonly expensesCategoriesService: ExpensesCategoriesService) {}

  @Post()
  create(@Body() createExpensesCategoryDto: CreateExpensesCategoryDto, @Request() req) {
    console.log(req.user);
    const userId = req.user.userId;
    return this.expensesCategoriesService.create(createExpensesCategoryDto, userId);
  }

  // @Get()
  // findAll() {
  //   return this.expensesCategoriesService.findAll();
  // }

  @Get()
  findByUser(@Request() req) {
    const userId = req.user.userId;
    return this.expensesCategoriesService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id:string) {
    return this.expensesCategoriesService.findOne(+id);
  }


  @Patch(':id')
  update(@Param('id') id:string , @Body() updateExpensesCategoryDto: UpdateExpensesCategoryDto) {
    return this.expensesCategoriesService.update(+id, updateExpensesCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id:string) {
    return this.expensesCategoriesService.remove(+id);
  }
}
