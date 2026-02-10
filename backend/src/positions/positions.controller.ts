import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './entities/position.entity';

@Controller('api/positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionsService.create(createPositionDto);
  }

  @Get()
  findAll() {
    return this.positionsService.findAll();
  }

  @Delete()
  remove() {
    return this.positionsService.remove();
  }

  /**
   * GET api/positions/:id intentionally not implemented
   * There is no intention in API to let client to retrieve one position
   * This was created while generating resource, and is being
   * left in for convenience in case of future need
   */
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.positionsService.findOne(+id);
  // }

  /**
   * PATCH api/positions/:id intentionally not implemented
   * There is no need to update existing historical positions
   * This was created while generating resource, and is being
   * left in for convenience in case of future need
   */
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto) {
  //   return this.positionsService.update(+id, updatePositionDto);
  // }

}
