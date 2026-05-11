import { Module } from '@nestjs/common';
import { ExpensesCategoriesService } from './expenses-categories.service';
import { ExpensesCategoriesController } from './expenses-categories.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExpensesCategoriesController],
  providers: [ExpensesCategoriesService],
})
export class ExpensesCategoriesModule {}
