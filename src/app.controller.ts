import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/ping')
  get(): { status: string } {
    return { status: 'ok' };
  }
}
