import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesCategoriesService } from './expenses-categories.service';

describe('ExpensesCategoriesService', () => {
  let service: ExpensesCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpensesCategoriesService],
    }).compile();

    service = module.get<ExpensesCategoriesService>(ExpensesCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
