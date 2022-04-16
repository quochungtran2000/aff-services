import { BaseResponse, CrawlPayload } from '@aff-services/shared/models/dtos';
import { Body, Controller, HttpException, Logger, Post, Req, Res } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CrawlService } from '../../services/crawl/crawl.service';

@ApiTags('Crawl')
@Controller('admin/crawl')
export class CrawlController {
  private readonly logger = new Logger(`Api-Gateway.${CrawlController.name}`);
  constructor(private readonly crawlService: CrawlService) {}

  @ApiOperation({ summary: 'Dùng để cào dữ liệu' })
  @ApiResponse({ type: BaseResponse })
  @Post()
  async crawlData(@Body() data: CrawlPayload, @Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`${this.crawlData.name} called`);
      const result = await this.crawlService.crawlData(CrawlPayload.from(data));
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}