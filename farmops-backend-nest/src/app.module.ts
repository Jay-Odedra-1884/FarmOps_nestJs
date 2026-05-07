import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ListingsModule } from './listings/listings.module';
import { FarmsModule } from './farms/farms.module';

@Module({
  imports: [PrismaModule, AuthModule, CategoryModule, ListingsModule, FarmsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
