import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesCategoriesController } from './expenses-categories.controller';
import { ExpensesCategoriesService } from './expenses-categories.service';

describe('ExpensesCategoriesController', () => {
  let controller: ExpensesCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesCategoriesController],
      providers: [ExpensesCategoriesService],
    }).compile();

    controller = module.get<ExpensesCategoriesController>(ExpensesCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
