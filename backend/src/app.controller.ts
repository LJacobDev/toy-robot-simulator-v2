import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

// Commenting these out to allow Vue static serve to appear
//  @Get()
//  getHello(): string {
//    return this.appService.getHello();
//  }
}
