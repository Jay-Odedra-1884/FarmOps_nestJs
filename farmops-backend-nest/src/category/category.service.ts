import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {

  constructor(
    private prisma: PrismaService
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name
      }
    })
    return {
      success: true,
      message: "Category created successfully",
      data: category
    };
  }

  async findAll() {
    const categories = await this.prisma.category.findMany()
    return {
      success: true,
      message: "Categories fetched successfully",
      data: categories
    };
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: id
      }
    })
    return {
      success: true,
      message: "Category fetched successfully",
      data: category
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: {
        id: id
      },
      data: {
        name: updateCategoryDto.name
      }
    })
    return {
      success: true,
      message: "Category updated successfully",
      data: category
    };
  }

  async remove(id: number) {
    const category = await this.prisma.category.delete({
      where: {
        id: id
      }
    })
    return {
      success: true,
      message: "Category deleted successfully",
      data: category
    };
  }
}
