import { Role } from "@prisma/client";

export class CreateAuthDto {
    name: string;
    email: string;
    mobile?: string;
    password: string;
    role?: Role;
}
