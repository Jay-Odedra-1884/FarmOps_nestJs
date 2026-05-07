import { Injectable } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ListingsService {

  constructor (
    private prisma: PrismaService
  ) {}

  async create(createListingDto: CreateListingDto) {
    const listing  = await this.prisma.listing.create({
      data: {
        title: createListingDto.title,
        description: createListingDto.description,
        image: createListingDto.image,
        categoryId: createListingDto.categoryId,
        userId: createListingDto.userId
      }
    });

    return {
      success: true,
      message: 'Listing created successfully',
      data: listing
    }
  }

  async findAll() {
    return {
      success: true,
      message: 'Listing fetched successfully',
      data: await this.prisma.listing.findMany({
        include: {
          category: true,
          user: true
        }
      })
    }
  }

  async findOne(id: number) {
    return {
      success: true,
      message: 'Listing fetched successfully',
      data: await this.prisma.listing.findUnique({
        where: {
          id: id
        }
      })
    }
  }

  async update(id: number, updateListingDto: UpdateListingDto) {
    const updatedListing = await this.prisma.listing.update({
      where: {
        id: id
      },
      data: {
        title: updateListingDto.title,
        description: updateListingDto.description,
        image: updateListingDto.image,
        categoryId: updateListingDto.categoryId,
        userId: updateListingDto.userId
      }
    })

    return {
      success: true,
      message: 'Listing updated successfully',
      data: updatedListing
    }
  }

  async remove(id: number) {
    const deletedListing = await this.prisma.listing.delete({
      where: {
        id: id
      }
    })

    return {
      success: true,
      message: 'Listing deleted successfully',
      data: deletedListing
    }
  }
}
