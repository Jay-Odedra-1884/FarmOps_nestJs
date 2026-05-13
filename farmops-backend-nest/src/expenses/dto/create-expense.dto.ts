import { ExpenseType } from "@prisma/client";
import { IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateExpenseDto{
    @IsNumber()
    @Min(0)
    amount: number

    @IsString()
    @IsOptional()
    @MaxLength(50)
    note: string

    @IsEnum(ExpenseType)
    type: ExpenseType

    @IsInt()
    categoryId: number

    @IsInt()
    cropId: number

    @IsInt()
    farmId: number

    @IsDate()
    expenseDate: Date
}