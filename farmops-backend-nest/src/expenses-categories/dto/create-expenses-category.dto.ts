import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateExpensesCategoryDto {
    @IsString()
    @IsNotEmpty()
    @Min(3)
    @Max(20)
    name: string;
}