import { CMD } from '@aff-services/shared/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: CMD.WELCOME_TO_USER })
  getData() {
    return this.appService.getData();
  }
}
