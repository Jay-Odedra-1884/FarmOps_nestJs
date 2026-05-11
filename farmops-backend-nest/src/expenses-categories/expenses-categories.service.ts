import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpensesCategoryDto } from './dto/create-expenses-category.dto';
import { UpdateExpensesCategoryDto } from './dto/update-expenses-category.dto';

@Injectable()
export class ExpensesCategoriesService {
    constructor(
        private prisma: PrismaService
    ) {}

    async create(createExpensesCategoryDto: CreateExpensesCategoryDto, userId:number) {
        const NewExpenseCategory = await this.prisma.expenseCategory.create({
            data: {
                name: createExpensesCategoryDto.name,
                userId: userId
            }
        })

        return {
            success: true,
            message: "Expense Category Created Successfully",
            data: NewExpenseCategory
        }
    }

    // async findAll() {
    //     const expensesCategorys = await this.prisma.expenseCategory.findMany();

    //     return {
    //         success:true,
    //         message: "Expenses Category Fetched Successfully",
    //         data: expensesCategorys
    //     }
    // }
    
    async findByUser(userId: number) {
        const userExpensesCategory = await this.prisma.expenseCategory.findMany({
            where: {
                userId: userId
            }
        })

        return {
            success: true,
            message: "Expenses Category Fetched Successfully",
            data: userExpensesCategory
        }
    }

    async findOne(id: number) {
        const expensecategory = await this.prisma.expenseCategory.findUnique({
            where: {
                id: id
            }
        })

        if(!expensecategory) {
            return {
                success: false,
                message: "Expense Category Not Found",
            }
        }

        return {
            success: true,
            message: "Expense Category Found",
            data: expensecategory
        }
    }

    async update(id: number, updateExpensesCtegoryDto: UpdateExpensesCategoryDto) {

        const existingExpensesCategory = await this.prisma.expenseCategory.findUnique({
            where: {
                id: id
            }
        }) 

        if(!existingExpensesCategory) {
            return {
                success: false,
                message: "Expense Category Not Found"
            }
        }

        const UpdatedExpenseCategory = await this.prisma.expenseCategory.update({
            where: {
                id: id
            },
            data: {
                name: updateExpensesCtegoryDto.name,
            }
        })

        return {
            success: true,
            message: "Expenses Category Updated",
            data: UpdatedExpenseCategory
        }
    }


    //delete
    async remove(id: number) {
        const existingExpensesCategory = await this.prisma.expenseCategory.findUnique({
            where: {
                id: id
            }
        })

        if(!existingExpensesCategory) {
            return {
                success: false,
                message: "Expense Category Not Found"
            }
        }

        const deletedExpensesCategory = await this.prisma.expenseCategory.delete({
            where: {
                id: id
            }
        })

        return {
            success: true,
            message: "Expense Category Deleted Successfully",
            data: deletedExpensesCategory
        }
    }
}

