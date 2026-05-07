import { IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @Min(3)
    @Max(50)
    name: string;
}
