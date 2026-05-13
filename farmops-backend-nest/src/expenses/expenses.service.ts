import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expenses.dto';

@Injectable()
export class ExpensesService {
    constructor(
        private prisma: PrismaService
    ){}

    //create
    async create(creatExpenseDto: CreateExpenseDto, userId: number) {
        const expense = await this.prisma.expense.create({
            data: {
                amount: creatExpenseDto.amount,
                note: creatExpenseDto.note,
                type: creatExpenseDto.type,
                categoryId: creatExpenseDto.categoryId,
                cropId: creatExpenseDto.cropId,
                farmId: creatExpenseDto.farmId,
                expenseDate: creatExpenseDto.expenseDate,
                userId: userId
            }
        })

        return {
            success: true,
            message: "Expense Created",
            data: expense
        }
    }

    //get all
    async findAll(userId: number, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [expenses, total] = await Promise.all([
            this.prisma.expense.findMany({
                where: { userId: userId },
                skip: skip,
                take: limit,
                orderBy: { expenseDate: 'desc' },
                include: {
                    category: true,
                    crop: true,
                    farm: true
                }
            }),
            this.prisma.expense.count({
                where: { userId: userId }
            })
        ]);

        return {
            success: true,
            message: "Expenses fetched successfully",
            data: expenses,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit)
            }
        }
    }

    //get by farm
    async findByFarm(farmId: number, userId: number, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [farmExpenses, total] = await Promise.all([
            this.prisma.expense.findMany({
                where: {
                    userId: userId,
                    farmId: farmId
                },
                skip: skip,
                take: limit,
                orderBy: { expenseDate: 'desc' },
                include: {
                    category: true,
                    crop: true,
                    farm: true
                }
            }),
            this.prisma.expense.count({
                where: {
                    userId: userId,
                    farmId: farmId
                }
            })
        ]);

        return {
            success: true,
            message: "Farm Expenses Retrived Successfully",
            data: farmExpenses,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit)
            }
        }
    }

    //update
    async update(id: number, updateExpenseDto: UpdateExpenseDto, userId: number) {
        const expense = await this.prisma.expense.findUnique({
            where:{
                id: id
            }
        })

        if(!expense) {
            return {
                success: false,
                message: "Expense Not Fount"
            }
        }

        if(expense.id != userId) {
            return {
                success: false,
                message: "You are Not owner of this Expense, you can't edit"
            }
        }

        const updatedExpense = await this.prisma.expense.update({
            where: {
                id: id
            },
            data: {
                amount: updateExpenseDto.amount,
                note: updateExpenseDto.note,
                type: updateExpenseDto.type,
                categoryId: updateExpenseDto.categoryId,
                cropId: updateExpenseDto.cropId,
                farmId: updateExpenseDto.farmId,
                expenseDate: updateExpenseDto.expenseDate,
            }
        })

        return {
            success: true,
            message: "Expense Updated",
            data: updatedExpense
        }
    }

    //delete
    async remove(id: number, userId: number) {
        const expense = await this.prisma.expense.findUnique({
            where:{
                id: id
            }
        })

        if(!expense) {
            return {
                success: false,
                message: "Expense not found",
            }
        }

        if(expense.userId != userId) {
            return {
                success: false,
                message: "You are not owner of this expense",
            }
        }

        const deletedExpense = await this.prisma.expense.delete({
            where: {
                id: id
            }
        })

        return {
            success: true,
            message: "Expense deleted",
            data: deletedExpense
        }
    }
}
