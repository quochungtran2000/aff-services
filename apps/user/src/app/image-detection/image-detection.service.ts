import { Injectable, Logger } from "@nestjs/common";


@Injectable()
export class ImageDetectionService {
  private readonly logger = new Logger(`Micro-User.${ImageDetectionService.name}`);

}
