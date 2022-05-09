import { Controller, Logger } from "@nestjs/common";
import { ImageDetectionService } from "./image-detection.service";

@Controller('imageDetection')
export class ImageDetectionController {

  private readonly logger = new Logger(`Micro-User.${ImageDetectionController.name}`);
  constructor(private readonly imageDetectionService: ImageDetectionService) {

  }
}
