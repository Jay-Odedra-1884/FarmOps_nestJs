import { Injectable } from '@nestjs/common';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CropsService {

  constructor(
    private prisma: PrismaService
  ) {}

  async create(createCropDto: CreateCropDto) {
    const res = await this.prisma.crop.create({
      data: {
        name: createCropDto.name,
        farmId: Number(createCropDto.farm_id)
      }
    })

    return {
      success: true,
      message: "Crop created successfully",
      data: res
    }
  }

  async findAll() {
    const res = await this.prisma.crop.findMany({
      select: {
        id: true,
        name: true,
        farmId: true
      }
    })

    return {
      success: true,
      message: "Crops fetched successfully",
      data: res
    }
  }

  async findOne(id: number) {
    const res = await this.prisma.crop.findUnique({
      where: {
        id: id
      }
    })

    return {
      success: true,
      message: "Crop fetched successfully",
      data: res
    }
  }

  async update(id: number, updateCropDto: UpdateCropDto) {
    const res = await this.prisma.crop.update({
      where: {
        id: id
      },
      data: {
        name: updateCropDto.name,
      }
    })

    return {
      success: true,
      message: "Crop updated successfully",
      data: res
    }
  }

  async remove(id: number) {
    const res = await this.prisma.crop.delete({
      where: {
        id: id
      }
    })

    return {
      success: true,
      message: "Crop deleted successfully",
      data: res
    }
  }
}
