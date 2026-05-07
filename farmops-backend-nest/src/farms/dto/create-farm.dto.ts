import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFarmDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    location:string

    @IsNumber()
    @IsOptional()
    size:number
}
