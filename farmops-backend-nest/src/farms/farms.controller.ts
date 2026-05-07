import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  create(@Body() createFarmDto: CreateFarmDto, @Request() req) {
    const userId = req.user.userId;
    return this.farmsService.create(createFarmDto, userId);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.userId;
    return this.farmsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.farmsService.findOne(+id, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto, @Request() req) {
    const userId = req.user.userId;
    return this.farmsService.update(+id, updateFarmDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.farmsService.remove(+id, userId);
  }
}
