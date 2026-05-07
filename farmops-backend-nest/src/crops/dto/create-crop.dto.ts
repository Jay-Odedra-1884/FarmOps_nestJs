import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCropDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(15)
    @MinLength(2)
    name:string;

    @IsNotEmpty()
    farm_id:number;
}
