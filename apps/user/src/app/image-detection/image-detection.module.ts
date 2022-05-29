import { Module } from "@nestjs/common";
import { ImageDetectionController } from "./image-detection.controller";


@Module({
  controllers: [ImageDetectionController]
})
export class ImageDetectionModule {}
