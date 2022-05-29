import { Test, TestingModule } from "@nestjs/testing";
import { ImageDetectionService } from "./image-detection.service";

describe('ImageDetectionService',  () => {
  let service : ImageDetectionService;

  beforeEach(async () => {
    const module:  TestingModule = await Test.createTestingModule({
      providers: [ImageDetectionService],
    }).compile();

    service = module.get<ImageDetectionService>(ImageDetectionService);
  })

  it('Should be defined', () => {
    expect(service).toBeDefined();
  })
})
