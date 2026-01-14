import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }


  @Get('generate')
  generate(@Body('animal') animal: string, @Query('animal') Q: string) {
    if (!animal) animal = Q
    const cleanAnimal = animal ? animal.charAt(0).toUpperCase() + animal.slice(1) : 'Random';
    const { fact, subject } = this.appService.generateFact(cleanAnimal);

    return {
      animal: subject,
      fact: fact
    };
  }

  @Post('save')
  save(@Body() body: { animal: string; fact: string }) {
    // return this.appService.saveFact(body.animal, body.fact);
    return "Done Saving";
  }
}