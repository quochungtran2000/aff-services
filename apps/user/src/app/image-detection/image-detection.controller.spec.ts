import { Test, TestingModule } from "@nestjs/testing";
import { ImageDetectionController } from "./image-detection.controller";

describe('ImageDetectionController', () => {
  let controller: ImageDetectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageDetectionController]
    }).compile();

    controller = module.get<ImageDetectionController>(ImageDetectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
})
