import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtservice: JwtService
  ) {}

  //service to create a new user
  async register(createAuthDto: CreateAuthDto){

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    return this.prisma.user.create({
      data: {
        email: createAuthDto.email,
        password: hashedPassword,
        name: createAuthDto.name,
        role: createAuthDto.role,
        mobile: createAuthDto.mobile || "",
      }
    });
  }

  //services to login user
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      success: true,
      data: user,
      message: "User logged in successfully",
      access_token: this.jwtservice.sign(payload),
    };
  }
}
