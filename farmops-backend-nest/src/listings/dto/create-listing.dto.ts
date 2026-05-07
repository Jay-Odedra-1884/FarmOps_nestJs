import { IsNumber, IsString, IsUrl, Max, Min } from "class-validator";

export class CreateListingDto {
    @IsString()
    @Min(3)
    @Max(50)
    title: string;

    @IsString()
    @Min(10)
    description: string;

    @IsUrl()
    image: string;

    @IsNumber()
    categoryId: number;

    @IsNumber()
    userId: number;
}
