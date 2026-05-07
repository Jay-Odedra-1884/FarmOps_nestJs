import { Injectable } from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FarmsService {

  constructor(
    private prisma:PrismaService
  ) {}

  async create(createFarmDto: CreateFarmDto, userId: number) {
    const newFarm = await this.prisma.farm.create({
      data: {
        name: createFarmDto.name,
        location: createFarmDto?.location,
        size: createFarmDto?.size?.toString(),
        userId: userId
      }
    })

    return {
      success: true,
      message: 'Farm created successfully.',
      data: newFarm
    }
  }

  async findAll(userId: number) {
    const farms = await this.prisma.farm.findMany({
      where: {
        userId: userId
      }
    })

    return {
      success: true,
      message: 'Farms fetched successfully.',
      data: farms
    }
  }

  async findOne(id: number, userId: number) {
    const farm = await this.prisma.farm.findUnique({
      where: { id }
    });

    if (!farm || farm.userId !== userId) {
      return {
        success: false,
        message: 'Farm not found or access denied.'
      };
    }

    return {
      success: true,
      data: farm
    };
  }

  async update(id: number, updateFarmDto: UpdateFarmDto, userId: number) {
    // Check ownership first
    const farm = await this.prisma.farm.findUnique({ where: { id } });
    if (!farm || farm.userId !== userId) {
      return {
        success: false,
        message: 'Farm not found or access denied.'
      };
    }

    const updatedFarm = await this.prisma.farm.update({
      where: { id },
      data: {
        ...updateFarmDto,
        size: updateFarmDto.size?.toString()
      }
    });

    return {
      success: true,
      message: 'Farm updated successfully.',
      data: updatedFarm
    };
  }

  async remove(id: number, userId: number) {
    // Check ownership first
    const farm = await this.prisma.farm.findUnique({ where: { id } });
    if (!farm || farm.userId !== userId) {
      return {
        success: false,
        message: 'Farm not found or access denied.'
      };
    }

    await this.prisma.farm.delete({ where: { id } });

    return {
      success: true,
      message: 'Farm removed successfully.'
    };
  }
}
